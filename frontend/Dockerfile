#stage 1
FROM node:alpine as build
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
#stage 2
FROM nginx
COPY --from=build /build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80