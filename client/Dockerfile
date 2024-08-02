FROM node:22-alpine as build

WORKDIR /app/client

COPY package*.json /app/client

RUN npm install
RUN npm install @angular/cli -g

COPY . /app/client/
COPY package-lock.json /app/client
EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
