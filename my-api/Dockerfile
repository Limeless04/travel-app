# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
# to leverage Docker cache for dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the NestJS application
# Assuming your build output is in 'dist'
RUN yarn build

# Expose the port your NestJS app listens on (default is 3000)
EXPOSE 3000

# Command to run the application
# Use "node dist/main" if your main file is in 'dist/main.js' after build
CMD ["node", "dist/main"]