# Use a Node.js base image for building
FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Build the React application
RUN yarn build

# Use a lightweight web server (like Nginx) to serve the static files
FROM nginx:alpine

# Copy the built React app to Nginx's static file directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration (optional, but recommended for single-page apps)
# This prevents issues with client-side routing (e.g., refreshing on a route other than '/')
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]