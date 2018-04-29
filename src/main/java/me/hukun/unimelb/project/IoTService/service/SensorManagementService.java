package me.hukun.unimelb.project.IoTService.service;

import java.util.List;

import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.service.response.AddNewSensorResponse;

public interface SensorManagementService {
	
	public AddNewSensorResponse addNewSensor(Sensor newSensor);
	public int updateSensor(Sensor sensor);
	public int deleteSensor(Sensor sensor);
	
	public List<Sensor> listAllSensors();
	

}
