FROM node:22.9-bookworm-slim

WORKDIR /usr/src/app1

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5003

CMD ["node","index.js"]