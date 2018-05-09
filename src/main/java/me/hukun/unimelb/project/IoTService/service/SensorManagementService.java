package me.hukun.unimelb.project.IoTService.service;

import java.util.List;

import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.service.response.AddNewSensorResponse;
import me.hukun.unimelb.project.IoTService.service.response.GetSensorCurrentDataResponse;
import me.hukun.unimelb.project.IoTService.service.response.UpdateSensorResponse;

public interface SensorManagementService {
	
	public AddNewSensorResponse addNewSensor(Sensor newSensor);
	public UpdateSensorResponse updateSensor(Sensor sensor);
	public int deleteSensor(Sensor sensor);
	public int deleteSensorById(String sensorId);
	
	public List<Sensor> listAllSensors();
	
	public List<Sensor> findSensorByTopic(String topic);
	
	public GetSensorCurrentDataResponse getSensorCurrentDataById(String sensorId);

}
