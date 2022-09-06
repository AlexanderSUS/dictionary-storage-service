FROM node:16.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

USER node

EXPOSE 4000

CMD ["npm", "run", "start:dev"]