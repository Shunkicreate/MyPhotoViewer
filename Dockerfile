# Use the official Node.js 22 image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . .

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# Install dependencies
RUN npm install

# Build the Remix app
RUN npm run build

# Expose a port (if your application needs it)
EXPOSE 5173

# Start the application using npx to ensure remix-serve is found
CMD ["npm", "run", "dev"]
