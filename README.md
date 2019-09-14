# IoTService (“My IoT Platform”)

The “My IoT Platform” is designed and implemented to resolve the IoT devices integration issue.

Management of  logic relationship among selected IoT device
Communication among selected IoT devices. (eg. machine-machine communication)


“My IoT Platform” is developed based on Springframe MVC.

“My IoT Platform” offers a list of RESTful based APIs. 

“My IoT Platform” communicates with Arduino based IoT devices ActiveMq by using MQTT protocol 

How to setup the running environment for this application

1.Java(JDK)  1.8

2.This application needs to deployed on apache Tomcat 8.0 or later

3.ActiveMq needs to be connected to this application (to setup the connection to ActiveMq, go to -- WEB-INF->iotService.properties, for configuration item mqtt.broker.url to set as mqtt.broker.url=<tcp://<ip address of activeMq host and port>

4.MongoDB needs to be connected to this application (to setup the connection to MangoDB, go to -- WEB-INF->iotService.properties,
set mongo.db.host=<the ip address of host name of the host where the mongo db is deployed>
mongo.db.port=<the port of the target mongo db server>
mongo.db.name=<the target mongo db database schema name>

The source code of “My IoT Platform” can be build by running the Maven (3.0) script. (target war fine IoTService.war will be generated once the Maven script is run.



Arduino 

Arduino IoT devices are being used as IoT device for testing purpose for this project.

Johnny-Five is a JavaScript library which provides a set of JavaScript API for JaveScript based application to work with Arduino device. In this project we are using the API provided in Johnny-Five library to read data from Arduino based IoT sensor and send command to the Arduino based IoT reactor. 

The end to end test is performed when the environment is setup as shown in figure 3.


Code under directory “arduino” is node.js based code which uses Jonny-Five library to communicate with Arduino devices.








