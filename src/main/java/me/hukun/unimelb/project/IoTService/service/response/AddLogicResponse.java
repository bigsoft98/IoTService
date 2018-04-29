package me.hukun.unimelb.project.IoTService.service.response;

import me.hukun.unimelb.project.IoTService.domain.Logic;

public class AddLogicResponse extends GenericTxResponse{

	Logic addedLogic;

	public Logic getAddedLogic() {
		return addedLogic;
	}

	public void setAddedLogic(Logic addedLogic) {
		this.addedLogic = addedLogic;
	}
	
	
	
}
