package me.hukun.unimelb.project.IoTService.service.response;

import me.hukun.unimelb.project.IoTService.domain.Sensor;

public class UpdateSensorResponse extends GenericTxResponse{
	
	Sensor updatedSensor;

	public Sensor getUpdatedSensor() {
		return updatedSensor;
	}

	public void setUpdatedSensor(Sensor updatedSensor) {
		this.updatedSensor = updatedSensor;
	}
	
	
	

}
