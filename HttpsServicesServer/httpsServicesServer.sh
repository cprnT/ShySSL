#!/bin/bash
#requestUrl is an ENV variable set apriori which specifies the host and the port used by the server (e.g. 192.168.0.1:3000) - neccesary
node HttpsServicesServer/index.js /HttpsServicesServer/webClient $requestUrl