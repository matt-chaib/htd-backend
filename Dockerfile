# Use an official node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json to the container
COPY package*.json .

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Set up environment variables
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL 

ARG REDDIT_SECRET
ENV REDDIT_SECRET=$REDDIT_SECRET 

ARG REDDIT_ACC_PASS
ENV REDDIT_ACC_PASS=$REDDIT_ACC_PASS 

# Generate Prisma client
RUN npx prisma generate

# RUN npx prisma migrate reset --force

# Apply database migrations (incremental)
RUN npx prisma migrate deploy

# Expose the port
EXPOSE 5003

# Command to run the seed script and start the server
CMD ["sh", "-c", "node prisma/seed.js && node ./src/server.js"]
