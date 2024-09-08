FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm install -D @swc/cli @swc/core
RUN npm run build


COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm", "run", "dev" ]