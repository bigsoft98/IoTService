var five = require("johnny-five");
var mqtt = require("mqtt");


var board = new five.Board();;

var yellowLed;
var yellowLedCommandTopic ='iot/platform/command/yellowLed';
var redLed;
var redLedCommandTopic ='iot/platform/command/redLed';
var greenLed;
var greenLedCommandTopic ='iot/platform/command/greenLed';

var tempSensor;
var tempSensorDataPublishTopic ='iot/platform/data/temp';


var mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.subscribe([yellowLedCommandTopic,redLedCommandTopic,greenLedCommandTopic]); 


board.on("ready", function() {
    
    yellowLed = new five.Led(4);
    redLed = new five.Led(2);
    greenLed = new five.Led(3);
    flameSensor = new five.Sensor("A2");
    tempSensor = new five.Thermometer({
        controller: "LM35",
        pin: "A0",
        freq: 2000
    });
    


    tempSensor.on("change", function() {
        currentCelsius = this.celsius;
        currentFahrenheit = this.fahrenheit;
        console.log(currentCelsius + "°C", currentFahrenheit + "°F");
        console.log("Publish to topic "+tempSensorDataPublishTopic +" "+currentCelsius);
        mqttClient.publish(tempSensorDataPublishTopic, currentCelsius += '');
    });



    mqttClient.on('message', function (topic, payload) {
        var message = payload.toString();
        console.log('Incoming message ['+message+'] from topic ['+topic+']');
        if(topic==yellowLedCommandTopic){
            if(message == 'on'){
                yellowLed.on();
            }else {
                yellowLed.off();
            }
        }else if(topic==redLedCommandTopic){
            if(message == 'on'){
                redLed.on();
            }else {
                redLed.off();
            }
        }else if(topic==greenLedCommandTopic){
            if(message == 'on'){
                greenLed.on();
            }else {
                greenLed.off();
            }
        }
    });
})