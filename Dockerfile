FROM centos:centos7
RUN     yum install -y epel-release
RUN 	yum install -y nodejs
RUN     yum install -y npm
COPY . ../httpsServicesServer
RUN     yum install -y openssl
RUN cd httpsServicesServer;ls;npm install;
EXPOSE 3000
CMD ["/bin/bash","/httpsServicesServer/httpsServicesServer.sh"]