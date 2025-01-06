FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY nest-cli.json tsconfig.json ./

RUN npm install

COPY src ./src

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
