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
   * @return {Promise<ArticleEntity>} - The created article.
   */
  async create(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    return new ArticleEntity(
      await this.articlesService.create(createArticleDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: [ArticleEntity] })
  /**
   * Finds all the articles.
   *
   * @return {Promise<ArticleEntity[]>} The list of articles.
   */
  async findAll(): Promise<ArticleEntity[]> {
    const articles = await this.articlesService.findAll();
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get('drafts')
  @ApiOkResponse({ type: [ArticleEntity] })
  /**
   * Retrieves a list of draft articles.
   *
   * @return {Promise<ArticleEntity[]>} A promise that resolves to an array of ArticleEntity objects representing the draft articles.
   */
  async findDrafts(): Promise<ArticleEntity[]> {
    const articles = await this.articlesService.findDrafts();
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get(':id')
  /**
   * Finds and returns the article with the specified ID.
   *
   * @param {string} id - The ID of the article to find.
   * @return {any} The found article.
   */
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articlesService.findOne(id);
    if (!article)
      throw new NotFoundException(`Article with ${id} id does not exist.`);
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
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  /**
   * A function that removes an article based on the given ID.
   *
   * @param {string} id - The ID of the article to be removed.
   * @return {Promise<ArticleEntity>} - A promise that resolves to the removed article entity.
   */
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ArticleEntity> {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
