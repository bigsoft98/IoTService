package me.hukun.unimelb.project.IoTService.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class GUIController {
	private static final String VIEW_INDEX = "index";
	private static final String ADD_LOGIC = "addLogic";
	private static final String ADD_SENSOR = "addSensor";
	private static final String ADD_REACTOR = "addReactor";
	private static final String TEMP_DATA ="tempM";

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String welcome(ModelMap model) {
		return VIEW_INDEX;
	}
	
	@RequestMapping(value ="/test/addLogic", method = RequestMethod.GET)
	public String addLogic(ModelMap model) {
		return ADD_LOGIC;
	}
	
	@RequestMapping(value ="/test/addSensor", method = RequestMethod.GET)
	public String addSensor(ModelMap model) {
		return ADD_SENSOR;
	}
	
	
	@RequestMapping(value ="/test/addReactor", method = RequestMethod.GET)
	public String addReactor(ModelMap model) {
		return ADD_REACTOR;
	}
	
	@RequestMapping(value ="/test/tempData", method = RequestMethod.GET)
	public String tempTest(ModelMap model) {
		return TEMP_DATA;
	}
}
