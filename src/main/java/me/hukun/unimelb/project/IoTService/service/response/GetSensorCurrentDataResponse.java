package me.hukun.unimelb.project.IoTService.service.response;

public class GetSensorCurrentDataResponse extends GenericTxResponse{

	String sensorId;
	String sensorDescription;
	String sensorCurrentData;
	
	public String getSensorId() {
		return sensorId;
	}
	public void setSensorId(String sensorId) {
		this.sensorId = sensorId;
	}
	public String getSensorDescription() {
		return sensorDescription;
	}
	public void setSensorDescription(String sensorDescription) {
		this.sensorDescription = sensorDescription;
	}
	public String getSensorCurrentData() {
		return sensorCurrentData;
	}
	public void setSensorCurrentData(String sensorCurrentData) {
		this.sensorCurrentData = sensorCurrentData;
	}
	
	
	
}
