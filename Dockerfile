FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt install -y gnupg2 git gcc g++ make dnsutils net-tools \
    inetutils-ftp inetutils-ping inetutils-tools inetutils-traceroute \
    openssh-client
    
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update && apt-get install nodejs npm -y

ADD ./myapp/ /myapp
RUN cd myapp && npm install
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "/myapp/bin/www"]
