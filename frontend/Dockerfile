FROM node:16-alpine

RUN mkdir -p /app && chown node:node /app
WORKDIR /app

USER node
COPY --chown=node:node package.json .

RUN npm install --legacy-peer-deps

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "start" ]