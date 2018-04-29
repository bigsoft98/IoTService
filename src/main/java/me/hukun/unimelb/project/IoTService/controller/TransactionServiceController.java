package me.hukun.unimelb.project.IoTService.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;


import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import me.hukun.unimelb.project.IoTService.domain.Logic;
import me.hukun.unimelb.project.IoTService.domain.Reactor;
import me.hukun.unimelb.project.IoTService.domain.Sensor;
import me.hukun.unimelb.project.IoTService.service.LogicImplementationService;
import me.hukun.unimelb.project.IoTService.service.LogicManagementService;
import me.hukun.unimelb.project.IoTService.service.MqttService;
import me.hukun.unimelb.project.IoTService.service.ReactorManagementService;
import me.hukun.unimelb.project.IoTService.service.SensorManagementService;
import me.hukun.unimelb.project.IoTService.service.response.AddLogicResponse;
import me.hukun.unimelb.project.IoTService.service.response.AddNewReactorResponse;
import me.hukun.unimelb.project.IoTService.service.response.AddNewSensorResponse;
import me.hukun.unimelb.project.IoTService.service.response.GetReactorCommandResponse;
import me.hukun.unimelb.project.IoTService.service.response.UpdateSensorDataResponse;

@RestController
public class TransactionServiceController {
	
	@Autowired
	SensorManagementService sensorManagementService;
	@Autowired
	ReactorManagementService reactorManagementService;
	@Autowired
	LogicManagementService logicManagementService;
	@Autowired
	LogicImplementationService logicImplementationService;
	@Autowired
	MqttService mqttService; 

	
	private static final Logger logger = Logger.getLogger(TransactionServiceController.class);
	
	
	//------- Sensor
	@RequestMapping(value="/addSensor",method ={RequestMethod.PUT,RequestMethod.POST})
	public ResponseEntity addSensor(@RequestBody String requestAddSensor, HttpServletRequest httpRequest){
		logger.debug("Received http request for addSensor, request data --"+requestAddSensor);
		Sensor sensor;
		  
		  try {  
			  sensor = new ObjectMapper().readValue(requestAddSensor, Sensor.class);
			  logger.info("Http Request received: (sensor) --- request detail "+ sensor.toString());
	
			  AddNewSensorResponse response = sensorManagementService.addNewSensor(sensor);
			  logger.debug("Response JSON "+ class2JSON(response));
			  return new ResponseEntity<AddNewSensorResponse>(response,HttpStatus.OK);
			
		  	} catch (IOException e) {
		  		logger.error("Cannot map request object "+ e.getMessage());
		  		return new ResponseEntity<AddNewSensorResponse>(HttpStatus.BAD_REQUEST);
		  	}
		
	}
	
	@RequestMapping(value="/deleteSensor",method ={RequestMethod.DELETE})
	public ResponseEntity deleteSensor(){
		
		return null;
	}
	
	@RequestMapping(value="/listSensor",method ={RequestMethod.GET})
	public ResponseEntity listSensor(HttpServletRequest httpRequest){
		
		logger.debug("Received http request for listDevice");
		
		List<Sensor> returnList = sensorManagementService.listAllSensors();
		
		return new ResponseEntity<List<Sensor>>(returnList,HttpStatus.OK);
		
	}
	@RequestMapping(value="/updateSensor",method ={RequestMethod.POST})
	public ResponseEntity updateSensor(){
		
		return null;
	}
	
	
	//------- Reactor
	
	@RequestMapping(value="/addReactor",method ={RequestMethod.PUT,RequestMethod.POST})
	public ResponseEntity addReactor(@RequestBody String requestAddReactor, HttpServletRequest httpRequest){
		
		logger.debug("Received http request for addReactor, request data --"+requestAddReactor);
		Reactor reactor;
		  
		  try {  
			  reactor = new ObjectMapper().readValue(requestAddReactor, Reactor.class);
			  logger.info("Http Request received: (reactor) --- request detail "+ reactor.toString());
	
			  AddNewReactorResponse response = reactorManagementService.addReactor(reactor);
			  logger.debug("Response JSON "+ class2JSON(response));
			  return new ResponseEntity<AddNewReactorResponse>(response,HttpStatus.OK);
			
		  	} catch (IOException e) {
		  		logger.error("Cannot map request object "+ e.getMessage());
		  		return new ResponseEntity<AddNewReactorResponse>(HttpStatus.BAD_REQUEST);
		  	}
	}
	
	@RequestMapping(value="/deleteReactor",method ={RequestMethod.DELETE})
	public ResponseEntity deleteReactor(){
		
		return null;
	}
	
	@RequestMapping(value="/listReactor",method ={RequestMethod.GET})
	public ResponseEntity listReactor(){
		
		logger.debug("Received http request for listReactor");
		
		List<Reactor> returnList = reactorManagementService.listAllReactor();
      
		//mqttService.publishMsg("new Test from hukun", "new");
		//mqttService.addSubscribeTopic("addedTopic");
		return new ResponseEntity<List<Reactor>>(returnList,HttpStatus.OK);
	}
	
	
	//-------- Reactor Command
	
	@RequestMapping(value="/getReactorCommand",method ={RequestMethod.GET})
	public ResponseEntity getReactorCommand(@RequestParam(value="reactorId", required=true) String reactorId){
		
		logger.debug("Received http request for getReactorCommand");
		
		try{
			GetReactorCommandResponse response = reactorManagementService.getReactorCommand(reactorId);
		
			return new ResponseEntity<GetReactorCommandResponse>(response,HttpStatus.OK);

		}catch (Exception e){
			logger.error(e.getCause());
			return new ResponseEntity<GetReactorCommandResponse>(HttpStatus.BAD_REQUEST);
		}
	
	}
	
	@RequestMapping(value="/sendReactorCommand",method ={RequestMethod.POST,RequestMethod.PUT})
	public ResponseEntity sendReactorCommand(@RequestParam(value="reactorId",required=true) String reactorId,
			@RequestParam(value="command",required=true) String command, String requestSendReactorCommand, HttpServletRequest httpRequest){
		
		logger.debug("Received http request for sendReactorCommand");
		
		if(reactorManagementService.setReactorCommand(reactorId, command)==0){
		
			return new ResponseEntity(HttpStatus.OK);
		}else{
			return new ResponseEntity(HttpStatus.METHOD_FAILURE);
		}
	}
	
	//--------Logic
	@RequestMapping(value="/addLogic",method ={RequestMethod.POST,RequestMethod.PUT})
	public ResponseEntity addLogic(@RequestBody String requestAddLigic, HttpServletRequest httpRequest){
		
		logger.debug("Received http request for addLogic");
		
		Logic logic;
		  
		  try {  
			  logic = new ObjectMapper().readValue(requestAddLigic, Logic.class);
			  logger.info("Http Request received: (logic) --- request detail "+ logic.toString());
	
			  AddLogicResponse response = logicManagementService.addLogic(logic);
			  logger.debug("Response JSON "+ class2JSON(response));
			  return new ResponseEntity<AddLogicResponse>(response,HttpStatus.OK);
			
		  	} catch (IOException e) {
		  		logger.error("Cannot map request object "+ e.getMessage());
		  		return new ResponseEntity<AddLogicResponse>(HttpStatus.BAD_REQUEST);
		  	}
	}
	
	@RequestMapping(value="/updateLogic",method ={RequestMethod.POST,RequestMethod.PUT})
	public ResponseEntity updateLogic(@RequestBody String requestUpdateLigic, HttpServletRequest httpRequest){
		
		logger.debug("Received http request for updateLogic");
		
		Logic logic;
		  
		  try {  
			  logic = new ObjectMapper().readValue(requestUpdateLigic, Logic.class);
			  logger.info("Http Request received: (logic) --- request detail "+ logic.toString());
	
			  logicManagementService.updateLogic(logic);
			  return new ResponseEntity<String>("Success",HttpStatus.OK);
			
		  	} catch (IOException e) {
		  		logger.error("Cannot map request object "+ e.getMessage());
		  		return new ResponseEntity<String>("Cannot map request objet "+e.getMessage(),HttpStatus.BAD_REQUEST);
		  	}
	}
	
	
	
	@RequestMapping(value="/deleteLogic",method ={RequestMethod.DELETE})
	public ResponseEntity deleteLogic(){
		
		return null;
	}
	
	@RequestMapping(value="/listLogic",method ={RequestMethod.GET})
	public ResponseEntity listLogic(){
		
		logger.debug("Received http request for listLogic");
		
		List<Logic> returnList = logicManagementService.listAllLogics();
		
		return new ResponseEntity<List<Logic>>(returnList,HttpStatus.OK);
	}
	
	
	@RequestMapping(value="/updateSensorData",method ={RequestMethod.POST})
	public ResponseEntity updateSensorData(@RequestParam(value="sensorId",required=true) String sensorId,
			@RequestParam(value="sensorData",required=true) String sensorData,HttpServletRequest httpRequest){
		
		
		logger.debug("Received http request for updateSensorData");
		
		logger.debug("Received sensorId= "+sensorId);
		logger.debug("Received sensorData= "+sensorData);
		
		
		UpdateSensorDataResponse response =logicImplementationService.procesSensorDataUpdate(sensorId,sensorData);
		
		
		return new ResponseEntity<UpdateSensorDataResponse>(response,HttpStatus.OK);
	}
	
	
	
	 private String class2JSON(Object obj){
		 
		 ObjectMapper mapper = new ObjectMapper();
		 mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);
		 try {
			 return mapper.writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			return "Fail to convert to JSON String";

		}
	 }
	
}
