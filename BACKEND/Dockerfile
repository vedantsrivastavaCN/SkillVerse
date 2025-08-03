# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Expose the backend port
EXPOSE 4000

# Use environment variables from .env (mount or copy in docker-compose)
CMD ["npm", "start"]
