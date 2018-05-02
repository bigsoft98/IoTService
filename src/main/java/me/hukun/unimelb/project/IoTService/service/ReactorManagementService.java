package me.hukun.unimelb.project.IoTService.service;

import java.util.List;

import me.hukun.unimelb.project.IoTService.domain.Reactor;
import me.hukun.unimelb.project.IoTService.service.response.AddNewReactorResponse;
import me.hukun.unimelb.project.IoTService.service.response.GetReactorCommandResponse;
import me.hukun.unimelb.project.IoTService.service.response.UpdateReactorResponse;

public interface ReactorManagementService {
	
	public AddNewReactorResponse addReactor(Reactor newReactor);
	public int deleteReactor(Reactor reactor);
	public int deleteReactorById(String reactorId);
	public List<Reactor> listAllReactor();
	public UpdateReactorResponse updateReactor(Reactor reactor);
	public GetReactorCommandResponse getReactorCommand(String reactorId);
	public int setReactorCommand(String reactorId,String command);

}
