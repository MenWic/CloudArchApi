FROM node:18

RUN mkdir -p /home/app
WORKDIR /home/app

COPY . /home/app

RUN npm install
RUN npm install -D nodemon

EXPOSE 3000

CMD ["npx", "nodemon", "src/index.js"]