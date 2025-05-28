# Travel Blog Full Stack Application

This repository contains a full-stack travel blog application consisting of a NestJS backend API and a React frontend application. The entire stack can be run using Docker Compose for easy development and deployment.

## Architecture

The application consists of three main components:

1. **Frontend (travel-app)**
   A React application built with TypeScript and Vite. you can read more detail on the README.md
3. **Backend API (my-api)**
   A NestJS API that handles data persistence and business logic. you can read more detail on the README.md
5. **Database**: PostgreSQL database for data storage

## ScreenShots

1. Homepage
   ![homepage](https://github.com/user-attachments/assets/64f1ae1e-d201-4b47-9b81-8ad959c361d3)
3. Login Page
   ![login](https://github.com/user-attachments/assets/722a7822-649c-4539-bfe3-dcdc45e7b8e1)
5. Registration Page
   ![registration](https://github.com/user-attachments/assets/6be21328-078c-4212-b0d4-447d5d7cbcfc)
6. Homepage (Authenticated)
   ![homepage(auth)](https://github.com/user-attachments/assets/fe92fdaa-d534-4b74-bcc0-95372ddaa8c6)
8. Article Detail
   ![articledetail](https://github.com/user-attachments/assets/e08807c4-0b23-4979-93f9-3b63469f8245)


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
REACT_APP_API_URL=http://localhost:3001
```

### 3. Running the Application

To start all services:

```bash
docker-compose up -d
```

or use podman:

```bash

podman compose --file docker-compose.yml --detach
```

This will start:

- PostgreSQL database on port 5432
- NestJS API on port 3001
- React frontend on port 80

To view the logs:

```bash
docker-compose logs -f
```


Run this to populate postgres with dummy data on development you can run this

```bash
docker-compose exec nestjs-api npm run seed
```

### 4. Accessing the Applications

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs (if Swagger is enabled)


### 5. Development Workflow

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

When launching the application using Docker, it's common to observe a brief delay before the frontend becomes fully functional. This is because the backend services, which the frontend relies on for data and operations, might take a few moments to initialize and become available within their respective Docker containers. During this brief startup period, if the frontend attempts to communicate with an unready backend, you will likely encounter "Network Error" messages in your browser or application logs. Please allow a few seconds for all services to start up completely before interacting with the frontend.

1. **Port Conflicts**

   - If port 80 is already in use, modify the frontend port in docker-compose.yml
   - If port 3001 is already in use, modify the backend port in docker-compose.yml
   - If port 5432 is already in use, modify the postgres port in docker-compose.yml

2. **Database Connection Issues**

   - Ensure the database container is running: `docker-compose ps`
   - Check database logs: `docker-compose logs postgres`

3. **API Connection Issues**
   - Verify the API is running: `docker-compose logs backend`
   - Check if the frontend environment variables are correctly set

### Useful Commands

```bash
# Rebuild all containers
docker-compose build

# Rebuild a specific service
docker-compose build frontend

# View logs for a specific service
docker-compose logs -f frontend

# Restart a specific service
docker-compose restart nestjs-api
```
