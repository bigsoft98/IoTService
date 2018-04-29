package me.hukun.unimelb.project.IoTService.service.response;

import me.hukun.unimelb.project.IoTService.domain.Reactor;

public class AddNewReactorResponse extends GenericTxResponse{
	
	Reactor addedReactor;

	public Reactor getAddedReactor() {
		return addedReactor;
	}

	public void setAddedReactor(Reactor addedReactor) {
		this.addedReactor = addedReactor;
	}
	
	

}
