package me.hukun.unimelb.project.IoTService.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class GUIController {
	private static final String VIEW_INDEX = "index";
	private static final String ADD_LOGIC = "addLogic";

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String welcome(ModelMap model) {
		return VIEW_INDEX;
	}
	
	@RequestMapping(value ="/addLogic", method = RequestMethod.GET)
	public String addLogic(ModelMap model) {
		return ADD_LOGIC;
	}
}
