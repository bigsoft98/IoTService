package me.hukun.unimelb.project.IoTService.domain;


import java.util.LinkedList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// Child class of Device class represent Sensor IoT device
@Document(collection = "sensor")
public class Sensor extends Device{
	@Id
	String id;
	List<String> associatedLogic=new LinkedList<String>();;
	String currentData ="0";
	String subMqttTopic;


	public List<String> getAssociatedLogic() {
		return associatedLogic;
	}
	public void setAssociatedLogic(List<String> associatedLogic) {
		this.associatedLogic = associatedLogic;
	}
	public String getCurrentData() {
		return currentData;
	}
	public void setCurrentData(String currentData) {
		this.currentData = currentData;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSubMqttTopic() {
		return subMqttTopic;
	}
	public void setSubMqttTopic(String subMqttTopic) {
		this.subMqttTopic = subMqttTopic;
	}


}

