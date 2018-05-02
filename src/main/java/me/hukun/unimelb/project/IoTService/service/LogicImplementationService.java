package me.hukun.unimelb.project.IoTService.service;

import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.service.response.UpdateSensorDataResponse;

public interface LogicImplementationService {
	
	// for mqtt incoming sensor data
	public void procesSensorDataUpdate(Sensor sensor,String sensorData);
	// for http incoming sensor data
	public UpdateSensorDataResponse processSensorDataUpdate(String sensorId, String sensorData);

}
