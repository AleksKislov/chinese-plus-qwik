FROM node:slim
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build.client
RUN npm run build.server
ENTRYPOINT ["node", "server/entry.express.js"]
EXPOSE 3000