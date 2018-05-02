package me.hukun.unimelb.project.IoTService.domain;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sensor")
public class Sensor extends Device{
	@Id
	String id;
	String[] associatedLogic;
	String currentData;
	
	String subMqttTopic;
	String subHttpUrl;
	String subHttpMethod;


	public String[] getAssociatedLogic() {
		return associatedLogic;
	}
	public void setAssociatedLogic(String[] associatedLogic) {
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
	public String getSubHttpUrl() {
		return subHttpUrl;
	}
	public void setSubHttpUrl(String subHttpUrl) {
		this.subHttpUrl = subHttpUrl;
	}
	public String getSubHttpMethod() {
		return subHttpMethod;
	}
	public void setSubHttpMethod(String subHttpMethod) {
		this.subHttpMethod = subHttpMethod;
	}
	


}

