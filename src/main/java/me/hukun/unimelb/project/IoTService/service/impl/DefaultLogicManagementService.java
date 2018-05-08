package me.hukun.unimelb.project.IoTService.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import me.hukun.unimelb.project.IoTService.domain.Logic;
import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.persistant.repository.LogicRepository;
import me.hukun.unimelb.project.IoTService.persistant.repository.SensorRepository;
import me.hukun.unimelb.project.IoTService.service.LogicManagementService;
import me.hukun.unimelb.project.IoTService.service.response.AddLogicResponse;

public class DefaultLogicManagementService implements LogicManagementService{

	@Autowired
	LogicRepository logicRepository;
	@Autowired
	SensorRepository sensorRepository;
	
	public List<Logic> listAllLogics() {
		
		return logicRepository.findAll();

	}

	public AddLogicResponse addLogic(Logic logic) {
		
		AddLogicResponse response = new AddLogicResponse();
		
		Logic addedLogic = logicRepository.save(logic);
		

		
		if(addedLogic==null){
			
			response.setAddedLogic(null);
			response.setCode("-1");
			response.setMessage("fail");
			
		}else{
			
			if(logic.getSensorIds()!=null){
				
				String[] sensorIds = logic.getSensorIds();
				for(int index =0; index <sensorIds.length;index++){
					
					Sensor sensor = sensorRepository.findById(sensorIds[index]).get();
					sensor.getAssociatedLogic().add(addedLogic.getId());
					sensorRepository.save(sensor);
				}
			}
			
			response.setAddedLogic(addedLogic);
			response.setCode("0");
			response.setMessage("success");
		}
		return response;
	}

	public int deleteLogic(Logic logic) {
		
		logicRepository.delete(logic);
		return 0;
	}

	public int updateLogic(Logic logic) {

		logicRepository.save(logic);
		return 0;
	}

}
