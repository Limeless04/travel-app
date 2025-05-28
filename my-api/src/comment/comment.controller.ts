import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CreateCommentDto, UpdateCommentDto } from './comment-dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({ status: 200, description: 'Return all comments.' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.commentService.findAll(page, limit);
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get comment by ID' })
  // @ApiResponse({ status: 200, description: 'Return comment by ID.' })
  // @ApiResponse({ status: 404, description: 'Comment not found.' })
  // findOne(@Param('id') id: string) {
  //   return this.commentService.findOne(Number(id));
  // }

  @Get(':id/article/:slug')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get Comment By Slug and Comment Id' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  updateBySlug(@Param('slug') slug: string, @Param('id') id: string) {
    return this.commentService.findBySlugAndId(slug, Number(id));
  }

  @Put(':id/article/:slug')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update Comment By Slug and Comment Id' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  update(
    @Param('id') id: string,
    @Param('slug') slug: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(Number(id), slug, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(Number(id));
  }
}
