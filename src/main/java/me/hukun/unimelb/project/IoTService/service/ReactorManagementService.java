package me.hukun.unimelb.project.IoTService.service;

import java.util.List;

import me.hukun.unimelb.project.IoTService.domain.Reactor;
import me.hukun.unimelb.project.IoTService.service.response.AddNewReactorResponse;
import me.hukun.unimelb.project.IoTService.service.response.GetReactorCommandResponse;
import me.hukun.unimelb.project.IoTService.service.response.UpdateReactorResponse;

public interface ReactorManagementService {
	
	// Create a new reactor object 
	public AddNewReactorResponse addReactor(Reactor newReactor);
	// delete a selected reactor object (return 0 for ok, return -1 for failure)
	public int deleteReactor(Reactor reactor);
	// delete a reactor object by passing reactorId (return 0 for ok, return -1 for failure)
	public int deleteReactorById(String reactorId);
	// list all registered reactor objects
	public List<Reactor> listAllReactor();
	// update a selected reactor object, return reactor object after updated
	public UpdateReactorResponse updateReactor(Reactor reactor);
	// get command list which registered for a reactor by passing reactor ID
	public GetReactorCommandResponse getReactorCommand(String reactorId);
	// set command for a registered reactor
	public int setReactorCommand(String reactorId,String command);
	// get reactor object by reactor id
	public Reactor getReactorById(String reactorId);

}
