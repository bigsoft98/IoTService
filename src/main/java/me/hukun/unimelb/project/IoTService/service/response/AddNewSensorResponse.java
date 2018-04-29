package me.hukun.unimelb.project.IoTService.service.response;

import me.hukun.unimelb.project.IoTService.domain.Sensor;

public class AddNewSensorResponse extends GenericTxResponse{

	Sensor addedSensor;

	public Sensor getAddedSensor() {
		return addedSensor;
	}

	public void setAddedSensor(Sensor addedSensor) {
		this.addedSensor = addedSensor;
	}


	
	
}
