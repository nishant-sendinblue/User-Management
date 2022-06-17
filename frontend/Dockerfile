#stage 1
FROM node:alpine AS builder
# Create app directory
WORKDIR /frontend
# Install app dependencies
COPY package*.json ./
RUN npm ci
# Copy app source code
COPY . /frontend/
RUN npm run build
#Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]

#stage 2
FROM nginx
COPY --from=builder /frontend/build/ /usr/share/nginx/html
EXPOSE 80
