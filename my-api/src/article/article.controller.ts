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
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './article-dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.articleService.findAll(page, limit);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likeOrUnlike(
    @Param('id') articleId: string,
    @Body('userId') userId: number,
  ) {
    // This toggles like/unlike based on current state
    return this.articleService.toggleLike(Number(articleId), userId);
  }

  
  @Get(":slug")
  @UseGuards(JwtAuthGuard)
  async findBySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(Number(id));
  }


  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateArticleDto,
  ) {
    return this.articleService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.articleService.remove(Number(id));
  }
}
