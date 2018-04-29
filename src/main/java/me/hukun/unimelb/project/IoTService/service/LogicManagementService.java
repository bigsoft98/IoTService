package me.hukun.unimelb.project.IoTService.service;

import java.util.List;

import me.hukun.unimelb.project.IoTService.domain.Logic;
import me.hukun.unimelb.project.IoTService.service.response.AddLogicResponse;

public interface LogicManagementService {
	
	public List<Logic> listAllLogics();
	public AddLogicResponse addLogic(Logic logic);
	public int deleteLogic(Logic logic);
	public int updateLogic(Logic logic);

}
