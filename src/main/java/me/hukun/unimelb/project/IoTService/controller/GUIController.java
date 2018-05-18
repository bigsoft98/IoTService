package me.hukun.unimelb.project.IoTService.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller

// GUI test page handler 
public class GUIController {
	private static final String VIEW_INDEX = "index";
	private static final String ADD_LOGIC = "addLogic";
	private static final String ADD_SENSOR = "addSensor";
	private static final String ADD_REACTOR = "addReactor";
	private static final String TEMP_DATA ="tempM";
	private static final String SEND_COMMAND = "sendCommand";

	// --- Root index page
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String welcome(ModelMap model) {
		return VIEW_INDEX;
	}
	
	// --- add logic test page
	@RequestMapping(value ="/test/addLogic", method = RequestMethod.GET)
	public String addLogic(ModelMap model) {
		return ADD_LOGIC;
	}
	
	// --- add sensor test page
	@RequestMapping(value ="/test/addSensor", method = RequestMethod.GET)
	public String addSensor(ModelMap model) {
		return ADD_SENSOR;
	}
	
	// --- add reactor test page
	@RequestMapping(value ="/test/addReactor", method = RequestMethod.GET)
	public String addReactor(ModelMap model) {
		return ADD_REACTOR;
	}
	
	// --- display received sensor data page (temperature sensor)
	@RequestMapping(value ="/test/tempData", method = RequestMethod.GET)
	public String tempTest(ModelMap model) {
		return TEMP_DATA;
	}
	
	// --- send registered command to registered reactor test page
	@RequestMapping(value ="/test/sendCommand", method = RequestMethod.GET)
	public String sendCommand(ModelMap model) {
		return SEND_COMMAND;
	}
	
}
