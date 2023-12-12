import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  /**
   * Create a new article.
   *
   * @param {CreateArticleDto} createArticleDto - The data to create the article.
   * @returns {Promise<ArticleEntity>} - The created article.
   */
  async create(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    // Create an article using the createArticleDto data
    const createdArticle = await this.articlesService.create(createArticleDto);

    // Create a new instance of the ArticleEntity class using the created article
    const articleEntity = new ArticleEntity(createdArticle);

    // Return the created article
    return articleEntity;
  }

  @Get()
  @ApiOkResponse({ type: [ArticleEntity] })
  /**
   * Retrieves all articles from the database.
   *
   * @returns {Promise<ArticleEntity[]>} The list of articles.
   */
  async findAll(): Promise<ArticleEntity[]> {
    // Retrieve all articles from the articles service
    const articles = await this.articlesService.findAll();

    // Map each article to a new ArticleEntity instance
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get('drafts')
  @ApiOkResponse({ type: [ArticleEntity] })
  /**
   * Retrieves a list of draft articles.
   *
   * @returns {Promise<ArticleEntity[]>} A promise that resolves to an array of ArticleEntity objects representing the draft articles.
   */
  async findDrafts(): Promise<ArticleEntity[]> {
    // Retrieve draft articles using the articles service
    const articles = await this.articlesService.findDrafts();

    // Create an array of ArticleEntity objects from the retrieved articles
    const draftArticles = articles.map((article) => new ArticleEntity(article));

    // Return the array of draft articles
    return draftArticles;
  }

  @Get(':id')
  /**
   * Retrieves an article by its ID.
   *
   * @param {string} id - The ID of the article to retrieve.
   * @returns {Promise<any>} - A promise that resolves to the retrieved article.
   * @throws {NotFoundException} - If the article with the specified ID does not exist.
   */
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    // Retrieve the article from the articlesService
    const article = await this.articlesService.findOne(id);

    // Throw an exception if the article does not exist
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} does not exist.`);
    }

    // Return the retrieved article
    return new ArticleEntity(article);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ArticleEntity })
  /**
   * Updates an article.
   *
   * @param {string} id - The ID of the article to be updated.
   * @param {UpdateArticleDto} updateArticleDto - The data to update the article with.
   * @return {Promise<ArticleEntity>} - The updated article entity.
   */
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    // Call the update method of the articlesService to update the article
    const updatedArticle = await this.articlesService.update(
      id,
      updateArticleDto,
    );

    // Create a new ArticleEntity instance with the updated article data
    const updatedArticleEntity = new ArticleEntity(updatedArticle);

    // Return the updated article entity
    return updatedArticleEntity;
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  /**
   * Removes an article based on the given ID.
   *
   * @param {string} id - The ID of the article to be removed.
   * @returns {Promise<ArticleEntity>} - A promise that resolves to the removed article entity.
   */
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ArticleEntity> {
    // Call the remove method of the articlesService passing in the id
    const removedArticle = await this.articlesService.remove(id);

    // Create a new instance of ArticleEntity with the removedArticle data
    const removedArticleEntity = new ArticleEntity(removedArticle);

    // Return the removedArticleEntity
    return removedArticleEntity;
  }
}
