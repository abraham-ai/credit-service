FROM node:18-alpine

RUN apk add --no-cache git

WORKDIR /usr/src/app

COPY . .

RUN yarn global add npx
RUN yarn global add ts-node
RUN yarn install --frozen-lockfile

EXPOSE 8000

ENTRYPOINT ["npx ts-node", "src/index.ts"]
 
