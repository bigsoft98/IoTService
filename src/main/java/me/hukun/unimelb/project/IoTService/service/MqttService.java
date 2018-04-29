package me.hukun.unimelb.project.IoTService.service;

import org.springframework.messaging.Message;

public interface MqttService {
	
	public void addSubscribeTopic(String newTopic);
	public void removeSubscribeTopic(String topic);
	
	public void publishMsg(String msgContent,String targetTopic);
	
	public void handleSubscribeTopicMsg(Message message);
	

}
