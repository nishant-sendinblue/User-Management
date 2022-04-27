FROM node:alpine
WORKDIR /usr/src/app

# dot . represents the WORKDIR
COPY package*.json ./
RUN npm ci
# we can aslo do npm install but ci is better practice
COPY . .

EXPOSE 5000
CMD ["npm","run","dev"]
