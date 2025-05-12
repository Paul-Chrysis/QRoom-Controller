FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install netcat for health check
RUN apk add --no-cache netcat-openbsd

# Expose the port Vite runs on
EXPOSE 5173

# Start the Vite development server with explicit host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
