FROM node:18.16.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9005
CMD ["node","app.js"]