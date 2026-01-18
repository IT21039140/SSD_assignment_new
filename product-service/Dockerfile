FROM node:22.22.0-bookworm-slim

WORKDIR /usr/src/app1

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5004

CMD ["node","index.js"]