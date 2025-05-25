import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article-dto';
import { NotFoundException } from '@nestjs/common';
import { Users } from '../entities/user.entity'; // Import Users entity
import { Like } from 'src/entities/like.entity';
import slugify from 'slugify';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Users) // Inject Users repository
    private userRepository: Repository<Users>,
    @InjectRepository(Like) // Inject Like repository
    private likeRepository: Repository<Like>,

  ) {}

  async findAll(page: number, limit: number): Promise<{data: Article[], total: number,  page: number; limit: number;}> {
    const skip = (page - 1) * limit;
    const [articles, total] = await this.articleRepository.findAndCount({
        skip,
        take: limit,
        order:{
            createdAt: 'DESC'
        }
        });

      return {
      data: articles,
      total: total,
      page: page,
      limit: limit,
    };
  }

  async findOne(id: number): Promise<Article | null> {
    return this.articleRepository.findOneBy({ id });
  }

  async findBySlug(slug: string): Promise<Article | null> {
    return this.articleRepository.findOne({ where: { slug },   relations: ['author', 'comments']  });
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {

    const {  authorId, title } = createArticleDto;

    const author = await this.userRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException(`Author with ID ${authorId} not found`);
    }

    const slug = slugify(title, { lower: true, strict: true });


    const newArticle = this.articleRepository.create({
      ...createArticleDto,
        slug,
        author: author,
    });
    return this.articleRepository.save(newArticle);
  }

  async toggleLike(articleId: number, userId: number): Promise<{liked: boolean; total_likes: number}> {
    const article = await this.articleRepository.findOneBy({ id: articleId });

    if (!article) throw new NotFoundException(`Article with ID ${articleId} not found`);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const existingLike = await this.likeRepository.findOne({
      where: { article: { id: articleId }, user: { id: userId } },
      relations: ['article', 'user'],
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.delete(existingLike.id);
      article.total_likes = Math.max(0, article.total_likes - 1);
      await this.articleRepository.save(article);
      return { liked: false, total_likes: article.total_likes };
    } else {
      // Like
      const like = this.likeRepository.create({ article, user });
      await this.likeRepository.save(like);
      article.total_likes += 1;
      await this.articleRepository.save(article);
      return { liked: true, total_likes: article.total_likes };
    }
  }

  async update(
    id: number,
    updateData: Partial<Article>,
  ): Promise<Article | null> {
    await this.articleRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
