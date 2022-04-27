#stage 1
FROM node:alpine AS builder
# Create app directory
WORKDIR /frontend
# Install app dependencies
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Copy app source code
#Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]
