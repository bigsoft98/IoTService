package me.hukun.unimelb.project.IoTService.service;

import me.hukun.unimelb.project.IoTService.domain.Sensor;


public interface LogicImplementationService {
	
	// for mqtt incoming sensor data
	public void procesSensorDataUpdate(Sensor sensor,String sensorData);
	

}
