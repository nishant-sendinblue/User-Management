FROM node:alpine as build
# Create app directory
WORKDIR /
# Install app dependencies
COPY package*.json ./
RUN npm ci
RUN npm run build
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]