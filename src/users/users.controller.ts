import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  /**
   * Create a new user.
   *
   * @param createUserDto - The data required to create a user.
   * @returns The newly created user entity.
   */
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const createdUser = await this.usersService.create(createUserDto);
    return new UserEntity(createdUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  /**
   * Retrieves all users and creates UserEntity objects.
   * @returns {Promise<UserEntity[]>} The list of UserEntity objects.
   */
  async findAll(): Promise<UserEntity[]> {
    // Retrieve all users
    const users = await this.usersService.findAll();

    // Create UserEntity objects for each user
    const userEntities = users.map((user) => new UserEntity(user));

    return userEntities;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  /**
   * Finds a user by their ID.
   *
   * @param id - The ID of the user (parsed as an integer).
   * @returns The user entity.
   */
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    // Call the usersService to find the user by ID.
    const user = await this.usersService.findOne(id);

    // Create a new UserEntity instance with the found user.
    return new UserEntity(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  /**
   * Update a user by ID.
   *
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data to update the user with.
   * @returns The updated UserEntity.
   */
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    // Call the update method of the usersService and pass in the ID and updateUserDto
    const updatedUser = await this.usersService.update(id, updateUserDto);
    // Create a new UserEntity using the updatedUser data
    return new UserEntity(updatedUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  /**
   * Removes a user entity.
   *
   * @param id - The id of the user entity to remove.
   * @returns The removed user entity.
   */
  async remove(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    // Call the remove method of the users service and create a new UserEntity instance with the result
    return new UserEntity(await this.usersService.remove(id));
  }
}
