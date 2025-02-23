# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port your app runs on
EXPOSE 3030

# Start the application
CMD ["npm", "run", "start:prod"]
