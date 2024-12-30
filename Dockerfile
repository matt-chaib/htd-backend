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

RUN npx prisma generate

# Expose the port
EXPOSE 5003

# Prod command to run application
CMD ["node", "./src/server.js"]