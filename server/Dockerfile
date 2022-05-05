FROM node:alpine
WORKDIR /server

# dot . represents the WORKDIR
COPY package*.json ./
RUN npm ci
# we can aslo do npm install but ci is better practice
COPY . /server/

EXPOSE 5000
CMD ["npm","run","dev"]
