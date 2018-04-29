package me.hukun.unimelb.project.IoTService.domain;


import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sensor")
public class Sensor extends Device{
	@Id
	String id;
	String[] associatedLogic;
	String sensorDataType;
	String currentData;
	



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
	

	public String getSensorDataType() {
		return sensorDataType;
	}
	public void setSensorDataType(String sensorDataType) {
		this.sensorDataType = sensorDataType;
	}
	

}

