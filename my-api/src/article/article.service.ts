import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article-dto';
import { NotFoundException } from '@nestjs/common';
import { Users } from '../entities/user.entity'; // Import Users entity
import { Likes } from 'src/entities/like.entity';
import slugify from 'slugify';
import { plainToInstance } from 'class-transformer';
import { ArticleDto } from './article-dto'; // Import ArticleDto for response transformation
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Users) // Inject Users repository
    private userRepository: Repository<Users>,
    @InjectRepository(Likes) // Inject Like repository
    private likeRepository: Repository<Likes>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Article[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [articles, total] = await this.articleRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
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

  async findBySlug(slug: string): Promise<ArticleDto | null> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'comments', 'comments.author', 'likes'],
    });
    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    return plainToInstance(ArticleDto, article, {
      excludeExtraneousValues: false,
    });
  }

  async findAllByUserId(
    id: number,
    page: number,
    limit: number,
  ): Promise<{ data: Article[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [articles, total] = await this.articleRepository.findAndCount({
      skip,
      take: limit,
      where: { author: { id } },
      order: {
        createdAt: 'DESC',
      },
      relations: ['author'],
    });

    return {
      data: articles,
      total: total,
      page: page,
      limit: limit,
    };
  }

  async create(
    createArticleDto: CreateArticleDto,
  ): Promise<{ data: Article; success: true }> {
    const { authorId, title } = createArticleDto;

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
    const savedArticle = await this.articleRepository.save(newArticle);

    return {
      data: savedArticle,
      success: true,
    };
  }

  async likeStatus(
    articleSlug: string,
    userId: number,
  ): Promise<{ total_likes: number }> {
    const article = await this.findBySlug(articleSlug);

    const articleEntity = await this.articleRepository.findOne({
      where: { id: article?.id },
    });

    if (!articleEntity)
      throw new NotFoundException(
        `Article with slug ${articleEntity} not found`,
      );

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if the user has already liked this article
    const existingLike = await this.likeRepository.findOne({
      where: {
        article: { id: articleEntity.id },
        user: { id: userId },
      },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      articleEntity.total_likes = Math.max(0, articleEntity.total_likes - 1);
    } else {
      const newLike = this.likeRepository.create({
        article: { id: articleEntity.id },
        user: { id: userId }, // or user.id if you prefer
      });
      await this.likeRepository.save(newLike);
      articleEntity.total_likes += 1;
    }

    // Save the updated total_likes back to the article
    await this.articleRepository.save(articleEntity);

    return { total_likes: articleEntity.total_likes };
  }

  async update(
    slug: string,
    updateData: UpdateArticleDto,
  ): Promise<ArticleDto | null> {
    await this.articleRepository.update({ slug }, updateData);
    return this.findBySlug(slug);
  }

  async remove(slug: string): Promise<void> {
    await this.articleRepository.delete({ slug });
  }
}
