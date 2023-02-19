FROM node:12-alpine
WORKDIR .
COPY  package.json /
COPY app.js /
RUN npm install .
CMD [ "node", "app.js" ]
