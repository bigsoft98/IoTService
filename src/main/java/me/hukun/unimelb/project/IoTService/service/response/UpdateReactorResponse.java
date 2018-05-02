package me.hukun.unimelb.project.IoTService.service.response;

import me.hukun.unimelb.project.IoTService.domain.Reactor;

public class UpdateReactorResponse extends GenericTxResponse{
	
	Reactor updatedReactor;

	public Reactor getUpdatedReactor() {
		return updatedReactor;
	}

	public void setUpdatedReactor(Reactor updatedReactor) {
		this.updatedReactor = updatedReactor;
	}
	
	
	

}
