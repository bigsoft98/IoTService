package me.hukun.unimelb.project.IoTService.service;

import java.util.List;

import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.service.response.AddNewSensorResponse;
import me.hukun.unimelb.project.IoTService.service.response.GetSensorCurrentDataResponse;
import me.hukun.unimelb.project.IoTService.service.response.UpdateSensorResponse;

public interface SensorManagementService {
	
	// Create a sensor, return the new sensor object
	public AddNewSensorResponse addNewSensor(Sensor newSensor);
	// Update a selected sensor object, return the sensor object after updated
	public UpdateSensorResponse updateSensor(Sensor sensor);
	// delete a selected sensor (return 0 for ok, -1 for failure)
	public int deleteSensor(Sensor sensor);
	// delete a selected sensor by passing sensorId (return 0 for ok, 01 for failure)
	public int deleteSensorById(String sensorId);
	// list all registered sensor object
	public List<Sensor> listAllSensors();
	// find registered sensor by passing mqtt topic
	public List<Sensor> findSensorByTopic(String topic);
	// get selected sensor's current data by passing sensorId
	public GetSensorCurrentDataResponse getSensorCurrentDataById(String sensorId);

}
