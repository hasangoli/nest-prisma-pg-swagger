import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  create(@Body() createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOkResponse({ type: [ArticleEntity] })
  /**
   * Finds all the articles.
   *
   * @return {Promise<ArticleEntity[]>} The list of articles.
   */
  findAll(): Promise<ArticleEntity[]> {
    return this.articlesService.findAll();
  }

  @Get('drafts')
  @ApiOkResponse({ type: [ArticleEntity] })
  /**
   * Retrieves a list of draft articles.
   *
   * @return {Promise<ArticleEntity[]>} A promise that resolves to an array of ArticleEntity objects representing the draft articles.
   */
  findDrafts(): Promise<ArticleEntity[]> {
    return this.articlesService.findDrafts();
  }

  @Get(':id')
  /**
   * Finds and returns the article with the specified ID.
   *
   * @param {string} id - The ID of the article to find.
   * @return {any} The found article.
   */
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
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
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  /**
   * A function that removes an article based on the given ID.
   *
   * @param {string} id - The ID of the article to be removed.
   * @return {Promise<ArticleEntity>} - A promise that resolves to the removed article entity.
   */
  remove(@Param('id') id: string): Promise<ArticleEntity> {
    return this.articlesService.remove(+id);
  }
}
