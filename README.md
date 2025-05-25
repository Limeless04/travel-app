# Travel Blog Full Stack Application

This repository contains a full-stack travel blog application consisting of a NestJS backend API and a React frontend application. The entire stack can be run using Docker Compose for easy development and deployment.

## Architecture

The application consists of three main components:

1. **Frontend (travel-app)**: A React application built with TypeScript and Vite
2. **Backend API (my-api)**: A NestJS API that handles data persistence and business logic
3. **Database**: PostgreSQL database for data storage

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Environment Setup

On Docker Compose Update the environment variabel, based on the .env on the backedn(my-api) and frontend (travel-app)

```env
# Database Configuration
POSTGRES_DB=mydb
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword

# API Configuration
NODE_ENV=development
JWT_SECRET=your_jwt_secret

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3000
```

### 3. Running the Application

To start all services:

```bash
docker-compose up -d
```
or using podman
```bash
podman-compose up -d

``

This will start:
- PostgreSQL database on port 5432
- NestJS API on port 3000
- React frontend on port 80

To view the logs:

```bash
docker-compose logs -f
```



### 4. Accessing the Applications

- Frontend: http://localhost
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api (if Swagger is enabled)

### 5. Development Workflow

#### Hot Reloading

Both the frontend and backend support hot reloading in development mode. Changes to the code will automatically trigger rebuilds.

#### Database Management

To access the PostgreSQL database directly:

```bash
docker-compose exec postgres psql -U myuser -d mydb
```

#### Running Database Migrations

```bash
docker-compose exec nestjs-api npm run migration:run
```

### 6. Stopping the Application

To stop all services:

```bash
docker-compose down
```

To stop and remove all data (including the database volume):

```bash
docker-compose down -v
```

## Project Structure

```
.
├── my-api/              # NestJS Backend
│   ├── src/            # Source code
│   ├── Dockerfile      # Backend Docker configuration
│   └── ...
├── travel-app/         # React Frontend
│   ├── src/           # Source code
│   ├── Dockerfile     # Frontend Docker configuration
│   └── ...
├── docker-compose.yml  # Docker Compose configuration
└── README.md          # This file
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - If port 80 is already in use, modify the frontend port in docker-compose.yml
   - If port 3000 is already in use, modify the backend port in docker-compose.yml

2. **Database Connection Issues**
   - Ensure the database container is running: `docker-compose ps`
   - Check database logs: `docker-compose logs postgres`

3. **API Connection Issues**
   - Verify the API is running: `docker-compose logs nestjs-api`
   - Check if the frontend environment variables are correctly set

### Useful Commands

```bash
# Rebuild all containers
docker-compose build

# Rebuild a specific service
docker-compose build nestjs-api

# View logs for a specific service
docker-compose logs -f nestjs-api

# Restart a specific service
docker-compose restart nestjs-api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 