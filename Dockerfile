FROM node:alpine3.21

LABEL maintainer="isaac"

RUN adduser -h /var/nodeapp \
      -s /bin/bash \
      -D nodeapp

WORKDIR /var/nodeapp

COPY index.js .
RUN chown nodeapp:nodeapp index.js

ARG VERSION

ENV VERSION=${VERSION:-1.0.0}

USER nodeapp
CMD ["node", "index.js"]