import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { Users } from 'src/entities/user.entity'; // Adjust the import path as necessary
import { Likes } from 'src/entities/like.entity'; // Adjust the import path as necessary

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource); // Get the TypeORM DataSource

  // Get repositories
  const userRepository = dataSource.getRepository(Users);
  const articleRepository = dataSource.getRepository(Article);
  const commentRepository = dataSource.getRepository(Comment);
  try {
    console.log('Seeding database...');

    console.log('Clearing existing data with TRUNCATE CASCADE...');
    // IMPORTANT: Truncate in the correct order for CASCADE to work effectively
    // Child tables first, then parent tables.
    // Also, use double quotes around table names in PostgreSQL if they are mixed case or contain special characters
    // (though TypeORM typically generates lowercase, it's safer for raw queries)

    await dataSource.query(
      'TRUNCATE TABLE "comments" RESTART IDENTITY CASCADE;',
    );
    await dataSource.query('TRUNCATE TABLE "likes" RESTART IDENTITY CASCADE;');
    await dataSource.query(
      'TRUNCATE TABLE "articles" RESTART IDENTITY CASCADE;',
    );
    await dataSource.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;');
    console.log('Data cleared.');

    // 2. Create dummy users
    const user1 = userRepository.create({
      id: 101, // Manually assign IDs if not using auto-increment for seeding
      username: 'travel_explorer',
      email: 'travel.explorer@example.com',
      password_hash:
        '$2y$10$l4fqvKboAmzE4WTKQTkjB.ySctGUbpaTQnCSRjJcOR3PojqNorFuO',
      // ... other user properties like password (hashed)
    });
    await userRepository.save(user1);

    const user2 = userRepository.create({
      id: 102,
      username: 'foodie_wanderer',
      email: 'foodie.wanderer@example.com',
      password_hash:
        '$2y$10$l4fqvKboAmzE4WTKQTkjB.ySctGUbpaTQnCSRjJcOR3PojqNorFuO',
      // ...
    });
    await userRepository.save(user2);

    const commentAuthor1 = userRepository.create({
      id: 201,
      username: 'adventure_lover',
      email: 'adventure.lover@example.com', // Add email if it's a required column
      password_hash:
        '$2y$10$l4fqvKboAmzE4WTKQTkjB.ySctGUbpaTQnCSRjJcOR3PojqNorFuO',
    });
    await userRepository.save(commentAuthor1);

    const commentAuthor2 = userRepository.create({
      id: 202,
      username: 'wanderlust_dreamer',
      email: 'wanderlust.dreamer@example.com',
      password_hash:
        '$2y$10$l4fqvKboAmzE4WTKQTkjB.ySctGUbpaTQnCSRjJcOR3PojqNorFuO',
    });
    await userRepository.save(commentAuthor2);

    const commentAuthor3 = userRepository.create({
      id: 203,
      username: 'java_explorer',
      email: 'java.explorer@example.com',
      password_hash:
        '$2y$10$l4fqvKboAmzE4WTKQTkjB.ySctGUbpaTQnCSRjJcOR3PojqNorFuO',
    });
    await userRepository.save(commentAuthor3);

    const commentAuthor4 = userRepository.create({
      id: 204,
      username: 'meat_lover',
      email: 'meat.lover@example.com',
      password_hash:
        '$2y$10$l4fqvKboAmzE4WTKQTkjB.ySctGUbpaTQnCSRjJcOR3PojqNorFuO',
    });
    await userRepository.save(commentAuthor4);

    // 3. Create dummy articles and link to users
    const article1 = articleRepository.create({
      id: 1,
      title:
        "Exploring Bali's Hidden Waterfalls: A Guide to Nungnung and Sekumpul",
      slug: 'exploring-balis-hidden-waterfalls-a-guide-to-nungnung-and-sekumpul',
      summary:
        "Discover the breathtaking beauty of Bali's lesser-known waterfalls...",
      content:
        'Bali, the Island of Gods, is renowned for its vibrant culture...',
      image_url:
        'https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      total_likes: 125,
      author: user1, // Link the user entity
      createdAt: new Date('2024-05-18T08:00:00Z'),
      updatedAt: new Date('2024-05-22T16:00:00Z'),
    });
    await articleRepository.save(article1);

    const article2 = articleRepository.create({
      id: 2,
      title:
        "A Foodie's Guide to Yogyakarta: Best Street Food and Local Delights",
      slug: 'a-foodies-guide-to-yogyakarta-best-street-food-and-local-delights',
      summary: 'Embark on a culinary journey through Yogyakarta, Indonesia...',
      content:
        'Yogyakarta, the cultural heart of Java, is not just about ancient temples...',
      image_url:
        'https://images.unsplash.com/photo-1630214801769-24784bfd2b9c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      total_likes: 98,
      author: user2, // Link the user entity
      createdAt: new Date('2024-05-17T12:00:00Z'),
      updatedAt: new Date('2024-05-23T10:30:00Z'),
    });
    await articleRepository.save(article2);

    // 4. Create dummy comments and link to articles and users
    const comment1 = commentRepository.create({
      id: 1,
      content: 'Nungnung is absolutely stunning! The hike down is worth it.',
      article: article1, // Link the article entity
      author: commentAuthor1,
      createdAt: new Date('2024-05-20T10:00:00Z'),
    });
    await commentRepository.save(comment1);

    const comment2 = commentRepository.create({
      id: 2,
      content:
        'Sekumpul looks incredible, definitely adding it to my itinerary!',
      article: article1,
      author: commentAuthor2,
      createdAt: new Date('2024-05-21T14:30:00Z'),
    });
    await commentRepository.save(comment2);

    const comment3 = commentRepository.create({
      id: 3,
      content:
        'Gudeg is my absolute favorite! This guide makes me miss Yogyakarta.',
      article: article2,
      author: commentAuthor3,
      createdAt: new Date('2024-05-19T09:15:00Z'),
    });
    await commentRepository.save(comment3);

    const comment4 = commentRepository.create({
      id: 4,
      content: 'Sate Klathak is a game-changer. So simple yet so delicious!',
      article: article2,
      author: commentAuthor4,
      createdAt: new Date('2024-05-20T11:45:00Z'),
    });
    await commentRepository.save(comment4);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Database seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
