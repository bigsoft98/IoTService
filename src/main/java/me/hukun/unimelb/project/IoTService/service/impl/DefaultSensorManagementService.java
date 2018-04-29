package me.hukun.unimelb.project.IoTService.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.persistant.repository.SensorRepository;
import me.hukun.unimelb.project.IoTService.service.SensorManagementService;
import me.hukun.unimelb.project.IoTService.service.response.AddNewSensorResponse;


public class DefaultSensorManagementService implements SensorManagementService{
	@Autowired
	SensorRepository sensorRepository;
	//MongoTemplate mongoTemplate;

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

	public int updateSensor(Sensor sensor) {
		// TODO Auto-generated method stub
		return 0;
	}

	public int deleteSensor(Sensor sensor) {
		
		sensorRepository.delete(sensor);
		return 0;
	}

	public List<Sensor> listAllSensors() {
		
		return this.sensorRepository.findAll();

	}


}
