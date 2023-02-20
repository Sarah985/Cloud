FROM node:12-alpine
WORKDIR .
COPY  package.json /
COPY app.js /
RUN npm install .
RUN npm install aws-sdk
CMD [ "node", "app.js" ]
