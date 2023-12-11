import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates an article using the provided data.
   *
   * @param {CreateArticleDto} createArticleDto - The data for creating the article.
   * @return {Promise<Article>} A promise that resolves to the created article.
   */
  create(createArticleDto: CreateArticleDto) {
    return this.prismaService.article.create({ data: createArticleDto });
  }

  /**
   * Retrieves all articles that are published.
   *
   * @return {Promise<Article[]>} An array of published articles.
   */
  findAll() {
    return this.prismaService.article.findMany({ where: { published: true } });
  }

  /**
   * Retrieves a list of draft articles.
   *
   * @return {Article[]} An array of draft articles.
   */
  findDrafts() {
    return this.prismaService.article.findMany({ where: { published: false } });
  }

  /**
   * Finds and returns a single article based on the provided ID.
   *
   * @param {number} id - The ID of the article to find.
   * @return {Promise<Article>} A promise that resolves to the found article, or null if not found.
   */
  findOne(id: number) {
    return this.prismaService.article.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  /**
   * Updates an article with the specified ID using the provided data.
   *
   * @param {number} id - The ID of the article to be updated.
   * @param {UpdateArticleDto} updateArticleDto - The data to update the article with.
   * @return {Promise<Article>} A promise that resolves to the updated article.
   */
  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prismaService.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  /**
   * Removes an article from the database.
   *
   * @param {number} id - The ID of the article to be removed.
   * @return {Promise<void>} - A promise that resolves when the article is successfully removed.
   */
  remove(id: number) {
    return this.prismaService.article.delete({ where: { id } });
  }
}
