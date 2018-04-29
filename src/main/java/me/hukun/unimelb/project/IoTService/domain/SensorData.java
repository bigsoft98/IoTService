package me.hukun.unimelb.project.IoTService.domain;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sensorData")
public class SensorData {
	
	
	String sensorId;
	String data;
	Date updateTime;

}
