FROM node:22-alpine as build

WORKDIR /app/client

COPY package*.json ./

RUN npm install @angular/cli -g
RUN npm install


EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
