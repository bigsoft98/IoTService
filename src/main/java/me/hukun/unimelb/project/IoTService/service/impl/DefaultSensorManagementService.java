package me.hukun.unimelb.project.IoTService.service.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.persistant.repository.SensorRepository;
import me.hukun.unimelb.project.IoTService.service.SensorManagementService;
import me.hukun.unimelb.project.IoTService.service.response.AddNewSensorResponse;
import me.hukun.unimelb.project.IoTService.service.response.UpdateSensorResponse;


public class DefaultSensorManagementService implements SensorManagementService{
	@Autowired
	SensorRepository sensorRepository;
	//MongoTemplate mongoTemplate;
	private static final Logger logger = Logger.getLogger(DefaultSensorManagementService.class);
	public AddNewSensorResponse addNewSensor(Sensor newSensor) {
	
		AddNewSensorResponse response = new AddNewSensorResponse();

		Sensor addedSensor = sensorRepository.save(newSensor);
	
		if(addedSensor== null){
			
			response.setAddedSensor(null);
			response.setCode("-1");
			response.setMessage("Fail");
		}else{
			response.setAddedSensor(addedSensor);
			response.setCode("0");
			response.setMessage("Success");
			
		}
		
		return response;
	}

	public UpdateSensorResponse updateSensor(Sensor sensor) {
		
		UpdateSensorResponse response = new UpdateSensorResponse();
		
		Sensor updatedSensor = sensorRepository.save(sensor);
		
		if(updatedSensor== null){
			
			response.setUpdatedSensor(null);
			response.setCode("-1");
			response.setMessage("Fail");
		}else{
			response.setUpdatedSensor(updatedSensor);
			response.setCode("0");
			response.setMessage("Success");
			
		}
		
		return response;
		
		
		
	}

	public int deleteSensor(Sensor sensor) {
		
		sensorRepository.delete(sensor);
		return 0;
	}

	public List<Sensor> listAllSensors() {
		
		return this.sensorRepository.findAll();

	}

	public int deleteSensorById(String sensorId) {
		
		try{
			sensorRepository.deleteById(sensorId);		
			return 0;
			
		}catch(Exception e){
			logger.error("Fail to delete reactor by id ("+sensorId+")");
			return -1;
		}
	}

	public List<Sensor> findSensorByTopic(String topic) {
		return sensorRepository.findSensorByTopic(topic);
	}


}
