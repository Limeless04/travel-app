import { Controller } from '@nestjs/common';
import {
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './article-dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('articles')
@ApiBearerAuth()
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination' })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'user id',
    required: false,
    type: Number,
    description: 'User Id',
  })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('user_id') userId?: number,
  ) {
    const result = userId
      ? await this.articleService.findAllByUserId(userId, page, limit)
      : await this.articleService.findAll(page, limit);
    return result;
  }

  @Post(':slug/like/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update Like or Unlike status of article by user id',
  })
  @ApiResponse({
    status: 200,
    description: 'Like status toggled successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateLikeStatus(
    @Param('slug') articleSlug: string,
    @Param('userId') userId: number,
  ) {
    // This toggles like/unlike based on current state
    return this.articleService.likeStatus(articleSlug, userId);
  }

  @Get(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get article by slug' })
  @ApiResponse({ status: 200, description: 'Return article by slug.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async findBySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'Return article by ID.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(Number(id));
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update an article' })
  @ApiResponse({ status: 200, description: 'Article successfully updated.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async update(
    @Param('slug') slug: string,
    @Body() updateUserDto: UpdateArticleDto,
  ) {
    return this.articleService.update(slug, updateUserDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an article' })
  @ApiResponse({ status: 200, description: 'Article successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async remove(@Param('slug') slug: string) {
    return this.articleService.remove(slug);
  }
}
