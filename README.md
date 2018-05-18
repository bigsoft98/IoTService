# IoTService
Spring MVC Restful and Mqtt based IoT management Platform 

To setup the running environment for this application

1.Java(JDK)  1.8
2.This application needs to deployed on apache Tomcat 8.0 or later
3.ActiveMq needs to be connected to this application (to setup the connection to ActiveMq, go to -- WEB-INF->iotService.properties, for configuration item mqtt.broker.url to set as mqtt.broker.url=<tcp://<ip address of activeMq host and port>
4.MangoDB needs to be connected to this application (to setup the connection to MangoDB, go to -- WEB-INF->iotService.properties,
set mongo.db.host=<the ip address of host name of the host where the mongo db is deployed>
mongo.db.port=<the port of the target mongo db server>
mongo.db.name=<the target mongo db database schema name>


