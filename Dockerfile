FROM node:10.15.1-alpine

COPY ./ /src

WORKDIR /src

CMD [ "yarn", "start" ]