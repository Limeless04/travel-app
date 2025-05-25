import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, ParseIntPipe, DefaultValuePipe, UsePipes, ValidationPipe} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CreateCommentDto, UpdateCommentDto } from './comment-dto';


@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createCommentDto: CreateCommentDto) {
        return this.commentService.create(createCommentDto);
    }

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.commentService.findAll(page, limit);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commentService.findOne(Number(id));
    }

    @Put(':id')
     @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.update(Number(id), updateCommentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.commentService.remove(Number(id));
    }
}
