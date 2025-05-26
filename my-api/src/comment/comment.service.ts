import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './comment-dto';
import { Article } from 'src/entities/article.entity'; // Import Article entity
import { NotFoundException } from '@nestjs/common';
import { Users } from 'src/entities/user.entity'; // Import Users entity

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article) // Inject Article repository
    private articleRepository: Repository<Article>,
    @InjectRepository(Users) // Inject Users repository
    private userRepository: Repository<Users>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Comment[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      data: comments,
      total: total,
      page: page,
      limit: limit,
    };
  }

  async findOne(id: number): Promise<Comment | null> {
    return this.commentRepository.findOneBy({ id });
  }

  async findByArticleCommentBySlug(slug: string): Promise<Comment[]> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    return this.commentRepository.find({
      where: { article: { id: article.id } },
      relations: ['author', 'article'], // Optional, if you need related data
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlugAndId(slug: string, id: number): Promise<Comment | null> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    const comment = await this.commentRepository.findOne({
      where: { id, article: { id: article.id } },
      relations: ['author', 'article'], // Optional, if you need related data
    });

    if (!comment) {
      throw new NotFoundException(
        `Comment with ID ${id} not found for article "${slug}"`,
      );
    }

    return comment;
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, articleId, authorId } = createCommentDto;

    const article = await this.articleRepository.findOneBy({ id: articleId });
    if (!article) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }

    const author = await this.userRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    const newComment = this.commentRepository.create({
      content,
      article: article, // Assign the found Article entity
      author: author, // Assign the found User entity
    });

    return this.commentRepository.save(newComment);
  }

  async update(
    id: number,
    slug: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment | null> {
    const { content } = updateCommentDto;
    const comment = await this.findBySlugAndId(slug, id);

    if (!comment) {
      throw new NotFoundException(
        `Comment with ID ${id} not found for article "${slug}"`,
      );
    }

    const updateData: Partial<Comment> = {
      content: updateCommentDto.content ?? comment.content,
    };

    await this.commentRepository.update(id, updateData);
    const updatedComment = await this.commentRepository.findOneBy({ id });
    return updatedComment;
  }

  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
