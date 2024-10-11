FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 3000

CMD ["npm", "run", "start"]
