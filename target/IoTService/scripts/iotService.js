function loadSensorId(url) {
	
	var sensorIdList = [];
	
	$.ajax({
        	crossDomain: true,
        	dataType: 'json',
        	url: url,
        	async:false,
        	success: function(sensorListData){
        		
            
	            for (var i in sensorListData)
	            {
	            	sensorIdList.push(sensorListData[i].id);
	            }
            
        	}
    	}
	);
    
	return sensorIdList;
}


function loadReactorId(url) {
	
	var reacrotIdList = [];
	
	$.ajax({
        	crossDomain: true,
        	dataType: 'json',
        	url: url,
        	async:false,
        	success: function(reactorListData){
        		
        		//alert(JSON.stringify(reactorListData));
            
	            for (var i in reactorListData)
	            {
	            	reacrotIdList.push(reactorListData[i].id);
	            }
            
        	}
    	}
	);
    
	return reacrotIdList;
}

function loadReactorMap(url){
	
	var reactorMap = new Map();
	
	
	$.ajax({
    	crossDomain: true,
    	dataType: 'json',
    	url: url,
    	async:false,
    	success: function(reactorListData){
    		
    		//alert(JSON.stringify(reactorListData));
        
            for (var i in reactorListData)
            {
            	
            	reactorMap.set(reactorListData[i].id,reactorListData[i]);

            }
        
    	  }
		}
	);
	
	return reactorMap;
	
}

function loadOption(dataArray,htmlItem){
	
   	for (var i in dataArray){
   		
   		$(htmlItem).append($("<option/>", {
   	        value: dataArray[i],
   	        text: dataArray[i]
   	    }));
   	};
}

function loadOptionWithDesc(map,htmlItem){
	
	$.each(map, function(k, v) {
   		$(htmlItem).append($("<option/>", {
   	        value: k,
   	        text: v.description
   	    }));
	  });
	
}


function submitLogic(url,logicData,responseElement){
	
	$.ajax({
		
		  url: url,
		  type: 'POST',
		  cache: 'false',
		  contentType: false,
		  data: logicData,
		  contentType: "application/json; charset=utf-8",
		  datatype: 'json',
		  success: function(data) {
				//alert(JSON.stringify(data));
				$(responseElement).val(JSON.stringify(data,undefined, 2));
				
		  }
		});
}