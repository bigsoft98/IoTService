package me.hukun.unimelb.project.IoTService.service;

import me.hukun.unimelb.project.IoTService.service.response.UpdateSensorDataResponse;

public interface LogicImplementationService {
	
	public UpdateSensorDataResponse procesSensorDataUpdate(String sensorId,String sensorData);

}
