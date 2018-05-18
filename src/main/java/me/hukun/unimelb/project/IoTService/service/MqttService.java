package me.hukun.unimelb.project.IoTService.service;

import org.springframework.messaging.Message;

public interface MqttService {
	
	// Add a new mqtt topic of subscribtion
	public void addSubscribeTopic(String newTopic);
	
	// Remove a subscribed mqtt topic
	public void removeSubscribeTopic(String topic);
	
	// Publish a message to a target mqtt topic
	public void publishMsg(String msgContent,String targetTopic);
	
	// Handle a incoming message
	public void handleSubscribeTopicMsg(Message message);
	

}
