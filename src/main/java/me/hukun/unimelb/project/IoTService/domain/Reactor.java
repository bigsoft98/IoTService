package me.hukun.unimelb.project.IoTService.domain;

import java.util.LinkedList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// Child class of Device, represent Reactor IoT Device
@Document(collection = "reactor")
public class Reactor extends Device{
	@Id
	String id;
	String pubMqttTopic;

	List<String> commandList = new LinkedList<String>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	public List<String> getCommandList() {
		return commandList;
	}
	public void setCommandList(List<String> commandList) {
		this.commandList = commandList;
	}
	public String getPubMqttTopic() {
		return pubMqttTopic;
	}
	public void setPubMqttTopic(String pubMqttTopic) {
		this.pubMqttTopic = pubMqttTopic;
	}


}

