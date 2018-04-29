package me.hukun.unimelb.project.IoTService.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "logic")
public class Logic {
	@Id
	String id;
	String description;
	
	String sensorIds[];
	String reactorIds[];
	
	String sensorRelation;
	String sensorThreshold[];
	String sensorThresholdRelation[];
	
	String reactorCommands[];

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String[] getSensorIds() {
		return sensorIds;
	}

	public void setSensorIds(String[] sensorIds) {
		this.sensorIds = sensorIds;
	}

	public String[] getReactorIds() {
		return reactorIds;
	}

	public void setReactorIds(String[] reactorIds) {
		this.reactorIds = reactorIds;
	}

	public String getSensorRelation() {
		return sensorRelation;
	}

	public void setSensorRelation(String sensorRelation) {
		this.sensorRelation = sensorRelation;
	}

	public String[] getSensorThreshold() {
		return sensorThreshold;
	}

	public void setSensorThreshold(String[] sensorThreshold) {
		this.sensorThreshold = sensorThreshold;
	}

	public String[] getSensorThresholdRelation() {
		return sensorThresholdRelation;
	}

	public void setSensorThresholdRelation(String[] sensorThresholdRelation) {
		this.sensorThresholdRelation = sensorThresholdRelation;
	}

	public String[] getReactorCommands() {
		return reactorCommands;
	}

	public void setReactorCommands(String[] reactorCommands) {
		this.reactorCommands = reactorCommands;
	}
	
	
	
	
	

}
