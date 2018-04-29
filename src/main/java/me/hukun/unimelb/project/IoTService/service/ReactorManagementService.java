package me.hukun.unimelb.project.IoTService.service;

import java.util.List;

import me.hukun.unimelb.project.IoTService.domain.Reactor;
import me.hukun.unimelb.project.IoTService.service.response.AddNewReactorResponse;
import me.hukun.unimelb.project.IoTService.service.response.GetReactorCommandResponse;

public interface ReactorManagementService {
	
	public AddNewReactorResponse addReactor(Reactor newReactor);
	public int deleteReactor(Reactor reactor);	
	public List<Reactor> listAllReactor();
	public GetReactorCommandResponse getReactorCommand(String reactorId);
	public int setReactorCommand(String reactorId,String command);

}
