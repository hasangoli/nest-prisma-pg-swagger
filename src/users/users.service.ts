import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new user.
   * @param createUserDto - The data to create the user.
   * @returns The created user.
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      process.env.ROUND_OF_HASHING,
    );

    // Update the password with the hashed value
    createUserDto.password = hashedPassword;

    // Create the user using the Prisma service
    return this.prismaService.user.create({ data: createUserDto });
  }

  /**
   * Returns all users.
   * @returns {Promise<UserEntity[]>} - A promise that resolves to an array of users.
   */
  async findAll(): Promise<UserEntity[]> {
    return this.prismaService.user.findMany();
  }

  /**
   * Find a user by their ID.
   * @param id - The ID of the user.
   * @returns The user object.
   */
  async findOne(id: number): Promise<UserEntity> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  /**
   * Updates a user record in the database.
   *
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data to update the user with.
   * @returns The updated user entity.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // Hash the password if it is provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        process.env.ROUND_OF_HASHING,
      );
    }

    // Update the user record in the database
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  /**
   * Removes a user from the database based on their ID.
   * @param id The ID of the user to be removed.
   * @returns A Promise that resolves to the deleted UserEntity object.
   */
  remove(id: number): Promise<UserEntity> {
    // Delete the user from the database using the provided ID.
    return this.prismaService.user.delete({ where: { id } });
  }
}
