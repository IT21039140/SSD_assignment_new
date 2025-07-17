FROM node:22.17.1-bookworm-slim

WORKDIR /usr/src/app1

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5004

CMD ["node","index.js"]