# ShySSL: TLS Certification Authority + WEB Configuration + Auto key configuration

When to use?
When you want to use self signed certificates. When you build a system that it is using TLS/SSL for communication between software components and doesn't make sense to buy recognised certificates.

This software provides a docker container with the folowing features:
- WEB UI to manage multiple organisations or entities owning privately signed TLS/SSL certificates
- TLS certification Authority using OpenSSL 
- automated configuration of the clients using REST service (for now only for node.js using https://github.com/salboaie/https-auto ) 
- simple centralised configuration management using REST (usable now with https://github.com/salboaie/https-auto)

 


