package me.hukun.unimelb.project.IoTService.service;

import java.util.List;

import me.hukun.unimelb.project.IoTService.domain.Logic;
import me.hukun.unimelb.project.IoTService.service.response.AddLogicResponse;

public interface LogicManagementService {
	
	// return all stored logic relation
	public List<Logic> listAllLogics();
	
	// return added logic relation object after create a logic 
	public AddLogicResponse addLogic(Logic logic);
	
	// delete a logic relation object (return 0 for ok, -1 for failure)
	public int deleteLogic(Logic logic);
	
	// update a logic relation object (return 0 for ok, -1 for failure)
	public int updateLogic(Logic logic);

}
