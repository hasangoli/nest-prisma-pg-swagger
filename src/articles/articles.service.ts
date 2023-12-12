import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates an article using the provided data.
   *
   * @param {CreateArticleDto} createArticleDto - The data for creating the article.
   * @returns {Promise<ArticleEntity>} A promise that resolves to the created article.
   */
  create(createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    // Create the article using the provided data
    return this.prismaService.article.create({ data: createArticleDto });
  }

  /**
   * Retrieves all published articles.
   *
   * @returns {Promise<ArticleEntity[]>} An array of published articles.
   */
  findAll(): Promise<ArticleEntity[]> {
    // Use the Prisma ORM to retrieve all articles where the published flag is true
    return this.prismaService.article.findMany({ where: { published: true } });
  }

  /**
   * Retrieves a list of draft articles.
   *
   * @return {Article[]} An array of draft articles.
   */
  findDrafts(): Promise<ArticleEntity[]> {
    // Use the Prisma ORM to query the database for draft articles
    return this.prismaService.article.findMany({ where: { published: false } });
  }

  /**
   * Finds a single article by its ID.
   *
   * @param {number} id - The ID of the article to find.
   * @returns {Promise<ArticleEntity>} A promise that resolves to the found article, or null if not found.
   */
  async findOne(id: number): Promise<ArticleEntity> {
    // Find the article using the provided ID
    const article = await this.prismaService.article.findUnique({
      where: { id },
      include: { author: true },
    });

    // Throw an exception if the article is not found
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Return the found article
    return article;
  }

  /**
   * Updates an article with the specified ID using the provided data.
   *
   * @param {number} id - The ID of the article to be updated.
   * @param {UpdateArticleDto} updateArticleDto - The data to update the article with.
   * @return {Promise<ArticleEntity>} A promise that resolves to the updated article.
   */
  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    // Find the article with the specified ID
    const article = await this.prismaService.article.findUnique({
      where: { id },
    });

    // If no article is found, throw an exception
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Use the Prisma service to update the article
    return this.prismaService.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  /**
   * Removes an article from the database.
   *
   * @param {number} id - The ID of the article to be removed.
   * @throws {NotFoundException} - If the article with the given ID is not found.
   * @returns {Promise<ArticleEntity>} - A promise that resolves when the article is successfully removed.
   */
  async remove(id: number): Promise<ArticleEntity> {
    // Find the article with the given ID
    const article = await this.prismaService.article.findUnique({
      where: { id },
    });

    // If the article is not found, throw a NotFoundException
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Delete the article with the given ID
    return this.prismaService.article.delete({ where: { id } });
  }
}
