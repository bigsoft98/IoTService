package me.hukun.unimelb.project.IoTService.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import me.hukun.unimelb.project.IoTService.domain.Reactor;
import me.hukun.unimelb.project.IoTService.persistant.repository.ReactorRepository;
import me.hukun.unimelb.project.IoTService.service.ReactorManagementService;
import me.hukun.unimelb.project.IoTService.service.response.AddNewReactorResponse;
import me.hukun.unimelb.project.IoTService.service.response.GetReactorCommandResponse;

public class DefaultReactorManagementService implements ReactorManagementService{
	
	@Autowired
	ReactorRepository reactorRepository;

	public AddNewReactorResponse addReactor(Reactor newReactor) {
		
		AddNewReactorResponse response = new AddNewReactorResponse();

		Reactor addedReactor =reactorRepository.save(newReactor);
		
		if(addedReactor == null){
			response.setAddedReactor(null);
			
			response.setCode("-1");
			response.setMessage("fail");
			
		}else{
			
			response.setAddedReactor(addedReactor);
			response.setCode("0");
			response.setMessage("success");
		}
		
		return response;
	}

	public int deleteReactor(Reactor reactor) {
		
		reactorRepository.delete(reactor);
		return 0;
	}

	public List<Reactor> listAllReactor() {
		
		return reactorRepository.findAll();
	
	}

	public GetReactorCommandResponse getReactorCommand(String reactorId) {
		
		GetReactorCommandResponse response = new GetReactorCommandResponse();
		Optional<Reactor> searchResult =reactorRepository.findById(reactorId);
		
		if(searchResult.isPresent()){
			Reactor reactor =searchResult.get();
			response.setCode("0");
			response.setMessage("success");
			response.setReactorId(reactor.getId());
			response.setReactorName(reactor.getName());
			response.setCommand(reactor.getCommand());
			
		}else{
			
			response.setCode("-1");
			response.setMessage("cannot find reactor by id --" +reactorId);
		}
		
		return response;
	}

	public int setReactorCommand(String reactorId, String command) {
		
		Optional<Reactor> searchReactorResult =reactorRepository.findById(reactorId);
		
		if(searchReactorResult.isPresent()){
			Reactor reactor = searchReactorResult.get();
			reactor.setCommand(command);
			reactorRepository.save(reactor);
			
			return 0;
		}else{
		
			return -1;
		}
	}

}
