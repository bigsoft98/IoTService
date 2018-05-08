package me.hukun.unimelb.project.IoTService.service.impl;


import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import me.hukun.unimelb.project.IoTService.domain.Logic;
import me.hukun.unimelb.project.IoTService.domain.Reactor;
import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.persistant.repository.LogicRepository;
import me.hukun.unimelb.project.IoTService.persistant.repository.ReactorRepository;
import me.hukun.unimelb.project.IoTService.persistant.repository.SensorRepository;
import me.hukun.unimelb.project.IoTService.service.LogicImplementationService;
import me.hukun.unimelb.project.IoTService.service.MqttService;


public class DefaultLogicImplementationService implements LogicImplementationService{
	@Autowired
	LogicRepository logicRepository;
	@Autowired
	ReactorRepository reactorRepository;
	@Autowired
	SensorRepository sensorRepository;
	@Autowired
	MqttService mqttService; 
	
	private static final Logger logger = Logger.getLogger(DefaultLogicImplementationService.class);
	
	public void procesSensorDataUpdate(Sensor affectSensor, String sensorData) {
		
		
		
		logger.debug("Process --- processSensorDataUpdate...");
		
		//Step 1 search for all sensor related logic
	
			
		logger.debug("Found associated logic by sensorId --- "+affectSensor.getId());
			
		updateSensorCurrentData(affectSensor, sensorData);
			
		List<String> logicIds = affectSensor.getAssociatedLogic();
			
		logger.debug("Total number of associated logic is "+logicIds.size());
			
		for(int index =0 ; index < logicIds.size() ; index ++){
				
			logger.debug("Start to process logic "+ logicIds.get(index));
				
			Logic currentLogic = logicRepository.findById(logicIds.get(index)).get();
									
				
			if(excuteCommand(currentLogic,checkSensorThreshold(currentLogic))){
				sendCommand(currentLogic);
			}
				
		}
					
	}
	
	
	
	
	
	
	
	
	
	
	
	private Boolean[] checkSensorThreshold(Logic logic){
		
		logger.debug("Start to check sensor threshold ...");
		String[] sensorIds = logic.getSensorIds();
		
		Boolean[] sensorThresholdCheckResults = new Boolean[sensorIds.length];
		
		
		for(int sensorIdIndex =0; sensorIdIndex < sensorIds.length;sensorIdIndex++){
			

			String currentSensorId = sensorIds[sensorIdIndex];
			logger.debug("Check sensor "+currentSensorId);
			
			String currentSensorData = sensorRepository.findById(currentSensorId).get().getCurrentData();
			logger.debug("SensorId: "+currentSensorId+" -- "+currentSensorData);
			
			String currentThresholdRelation = logic.getSensorThresholdRelation()[sensorIdIndex];
			logger.debug("SensorId: "+ currentSensorId+" -- "+ currentThresholdRelation);
			
			String currentThreshold = logic.getSensorThreshold()[sensorIdIndex];
			logger.debug("SensorId: "+ currentSensorId+" -- "+ currentThreshold);
			
			if(currentThresholdRelation.equals("GT")){
				
				if(Double.parseDouble(currentSensorData) > Double.parseDouble(currentThreshold)){
					
					sensorThresholdCheckResults[sensorIdIndex] = true;
				}else{
					
					sensorThresholdCheckResults[sensorIdIndex] = false;
				}
				
			}else if (currentThresholdRelation.equals("LT")){
				
				if(Double.parseDouble(currentSensorData) < Double.parseDouble(currentThreshold)){
					
					sensorThresholdCheckResults[sensorIdIndex] = true;
				}else{
					sensorThresholdCheckResults[sensorIdIndex] = false;
				}
				
			}else if (currentThresholdRelation.equals("E")){
				
				if(Double.parseDouble(currentSensorData) == Double.parseDouble(currentThreshold)){
					
					sensorThresholdCheckResults[sensorIdIndex] = true;
				}else{
					
					sensorThresholdCheckResults[sensorIdIndex] = false;
				}
			}
			
		}
			logger.debug("Return sensor threshold check result "+sensorThresholdCheckResults);
			return sensorThresholdCheckResults;
		
	}
	
	// only two possible cases , all AND or all or
	private boolean excuteCommand(Logic logic,Boolean[] sensorThresholdCheckResults){
		
		boolean excuteCommand =true;	
		
		if(logic.getSensorRelation().equals("AND")){
			
			// every element in sensorThresholdCheckResults must be true
			
			for(int checkResultIndex = 0; checkResultIndex <sensorThresholdCheckResults.length;checkResultIndex++){
				
				if (!sensorThresholdCheckResults[checkResultIndex]){
					excuteCommand =false;
				}
			}
			
			
		}else{
			// at least on element in sensorThresholdCheckResults is true is fine
			for(int checkResultIndex = 0; checkResultIndex <sensorThresholdCheckResults.length;checkResultIndex++){
				
				if (sensorThresholdCheckResults[checkResultIndex]){
					excuteCommand =true;
				}
			}
		}
		
		logger.debug("Excute Command (ture/false): "+ excuteCommand);
		return excuteCommand;
	}
	
	
	
	private void sendCommand(Logic logic){
		
		logger.debug("sendCommand ...");
		String[] reactorIds = logic.getReactorIds();
		String[] commands = logic.getReactorCommands();
		
		// send command to each registered reactor
		for(int reactorIndex=0; reactorIndex < reactorIds.length; reactorIndex++){
									
			Reactor currentReactor = reactorRepository.findById(reactorIds[reactorIndex]).get();
			
				// send device command
			//currentReactor.setCommand(commands[reactorIndex]);

			
				
			mqttService.publishMsg(commands[reactorIndex], currentReactor.getPubMqttTopic());
				
			
			
			reactorRepository.save(currentReactor);
				
			logger.debug("Set command for reactor("+currentReactor.getId()+") --- "+commands[reactorIndex] );
			
		}
		
	}
	
	private void updateSensorCurrentData(Sensor sensor, String currentData){

			sensor.setCurrentData(currentData);
			sensorRepository.save(sensor);
		
	}

}
