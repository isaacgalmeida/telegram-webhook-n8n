FROM node:alpine3.21

LABEL maintainer="isaac"

RUN adduser -h /var/nodeapp \
      -s /bin/bash \
      -D nodeapp

WORKDIR /var/nodeapp

# Copy package.json and package-lock.json (if available) and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application source code
COPY index.js .
RUN chown -R nodeapp:nodeapp /var/nodeapp

ARG VERSION

ENV VERSION=${VERSION:-1.0.0}

USER nodeapp
CMD ["node", "index.js"]