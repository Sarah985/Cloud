FROM node:12-alpine
WORKDIR .
COPY  package.json /
COPY app.js /
RUN npm install .
RUN npm install aws-sdk
RUN npm install formidable
CMD [ "node", "app.js" ]
