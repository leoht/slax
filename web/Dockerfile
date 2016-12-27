FROM ubuntu:latest

RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get update && apt-get upgrade -y && apt-get install -y curl wget git make nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD . /web
WORKDIR /web

RUN npm install http-server -g
CMD ["http-server", "-p", "3000"]
