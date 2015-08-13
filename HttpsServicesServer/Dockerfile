FROM centos:centos7
RUN     yum install -y epel-release
RUN 	yum install -y nodejs
RUN     yum install -y npm
COPY . ../HttpsServicesServer
RUN     yum install -y openssl
RUN cd HttpsServicesServer;ls;npm install;
EXPOSE 3000
CMD ["/bin/bash","/HttpsServicesServer/httpsServicesServer.sh"]