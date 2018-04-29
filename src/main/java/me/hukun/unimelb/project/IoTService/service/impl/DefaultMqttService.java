package me.hukun.unimelb.project.IoTService.service.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import me.hukun.unimelb.project.IoTService.service.MqttService;


public class DefaultMqttService implements MqttService{
	
	@Autowired
	private MqttPahoMessageHandler mqttOutboundHandler;
	@Autowired
	private MqttPahoMessageDrivenChannelAdapter mqttInboundAdapter;
	
	private static final Logger logger = Logger.getLogger(DefaultMqttService.class);
	
	//GenericMessage [payload=new msg to adding topic, headers={mqtt_receivedRetained=false, id=4c2c3f1f-0513-90ab-af33-36d7019e5142, mqtt_duplicate=false, mqtt_receivedTopic=addingTopic, mqtt_receivedQos=0, timestamp=1524996856518}]
	

	// Realtime add subscribe topic
	public void addSubscribeTopic(String newTopic) {
		
		 mqttInboundAdapter.addTopic(newTopic);
		
	}

	// Realtime remove subscribe topic
	public void removeSubscribeTopic(String topic) {
	
		mqttInboundAdapter.removeTopic(topic);
	
	}

	// Publish msg to target topic
	public void publishMsg(String msgContent, String targetTopic) {
		
		logger.debug("Sending msg "+ msgContent +" to targetTopic "+targetTopic);
		Message<String> message = MessageBuilder.withPayload(msgContent).setHeader(MqttHeaders.TOPIC, targetTopic).build();  
		mqttOutboundHandler.handleMessage(message);  
		
	}

	// Subscribe Message handler
	public void handleSubscribeTopicMsg(Message message) {
		logger.debug("Incoming Msg from topic --"+message.getHeaders().get("mqtt_receivedTopic"));
		logger.debug("Incoming msg content --"+message.getPayload().toString());
	}
}
