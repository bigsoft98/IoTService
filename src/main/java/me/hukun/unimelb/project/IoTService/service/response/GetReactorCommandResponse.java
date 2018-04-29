package me.hukun.unimelb.project.IoTService.service.response;

public class GetReactorCommandResponse extends GenericTxResponse{

	String command;
	String reactorId;
	String reactorName;
	
	public String getReactorId() {
		return reactorId;
	}

	public void setReactorId(String reactorId) {
		this.reactorId = reactorId;
	}

	public String getReactorName() {
		return reactorName;
	}

	public void setReactorName(String reactorName) {
		this.reactorName = reactorName;
	}

	public String getCommand() {
		return command;
	}

	public void setCommand(String command) {
		this.command = command;
	}
	
	
}
