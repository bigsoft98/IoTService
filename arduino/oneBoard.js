// The purpose of this piece of code is communicate with four pre configured IoT devices
// A Temperature Sensor (Sensor)
// Three LEDs (yellow, green, red) (reactors)
// The reactors can receive command via Mqtt broker
// The sensor can send value to the target topic via Mqtt broker
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

// connect to mqtt broker
var mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.subscribe([yellowLedCommandTopic,redLedCommandTopic,greenLedCommandTopic]); 


board.on("ready", function() {
    // set up yellow led (pin 4)
    yellowLed = new five.Led(4);
    //set up red led (pin 2)
    redLed = new five.Led(2);
    // set up green led (pin 3)
    greenLed = new five.Led(3);
    //set up temperature sensor (pin A0)
    tempSensor = new five.Thermometer({
        controller: "LM35",
        pin: "A0",
        freq: 2000
    });
    

    // detece temperature change, once the temperature is changed, send the new temp value the target topic via mqtt broker
    tempSensor.on("change", function() {
        currentCelsius = this.celsius;
        currentFahrenheit = this.fahrenheit;
        console.log(currentCelsius + "°C", currentFahrenheit + "°F");
        console.log("Publish to topic "+tempSensorDataPublishTopic +" "+currentCelsius);
        mqttClient.publish(tempSensorDataPublishTopic, currentCelsius += '');
    });


    // as mqtt client subscribue the messge from topics associate with the reactors 
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