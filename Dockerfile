FROM node:10

# Create app directory
WORKDIR /usr/src/app

ARG commentColl=default_value
ARG memberColl=default_value
ARG trashCommentColl=default_value
ARG organisationsColl=default_value
ARG testDbName=default_value
ARG dbNAme=default_value
ARG mongoUri=default_value

ENV commentColl=$commentColl
ENV memberColl=$memberColl
ENV trashCommentColl=$trashCommentColl
ENV organisationsColl=$organisationsColl
ENV testDbName=$testDbName
ENV mongoUri=$mongoUri
ENV dbName=$dbName

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
