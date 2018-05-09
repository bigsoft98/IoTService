<html>
        <head>
                <title>IoTService ---Add Logic</title>
                <link rel="stylesheet" type="text/css" href="../styles/style.css"/>
                <script type="text/javascript" src="../scripts/jquery.min.js"></script>
                <script type="text/javascript" src="../scripts/iotService.js"></script>
                
                <script type="text/javascript">
                    $(document).ready(function(){
               			
                    	var sensorIdList =loadSensorId('/IoTService/listSensor');
                    	var reactorIdList = loadReactorId('/IoTService/listReactor');
             			
                    	var reactorIdMap = loadReactorMap('/IoTService/listReactor');
                    	
                    	
                       	
                        loadOption(sensorIdList,'#selectedSensorIds');
                       	//loadOption(reactorIdList,'#selectedReactorIds');
                       	loadOptionWithDesc(reactorIdMap,'#selectedReactorIds');
                       	
                       	
                       	//loadOption(Object.keys(reactorIdMap),'#selectedReactorIds');
                       	
                       	
                        var sensorIds=[];
                        var sensorThreshold=[];
                        var sensorThresholdRelation=[];
                        
                       	
                        $("#addSensorThreshold").click(function(){
                            var sensorId = $("#selectedSensorIds").val();
                            var sensorRelation = $("#selectedRelations").val();
                            var thresholdValue = $("#thresholdValue").val();
                            var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + sensorId + "</td><td>" + sensorRelation + "</td><td>" + thresholdValue + "</td></tr>";
                            sensorIds.push(sensorId);
                            sensorThresholdRelation.push(sensorRelation);
                            sensorThreshold.push(thresholdValue);
                            $("#sensorThresholdTable").append(markup);                  
                            //index = sensorIdList.indexOf(sensorId)
                            //sensorIdList.splice(index, 1);
                            //loadOption(sensorIdList,'#selectedSensorIds');
                        });
                        
                     
                        
                        var reactorIds=[];
                        var reactorCommands=[];
                        
                        $("#addReactorCommand").click(function(){
                            var reactorId = $("#selectedReactorIds").val();
                            var reactorCommand = $("#reactorCommand").val();
                            var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + reactorId + "</td><td>" + reactorCommand + "</td></tr>";
                            reactorIds.push(reactorId);
                            reactorCommands.push(reactorCommand);
                            $("#reactorCommandTable").append(markup);
                        });
                        
                        
                        
                        $("#deleteReactorCommand").click(function(){
                            $("#reactorCommandTable").find('input[name="record"]').each(function(){
                            	if($(this).is(":checked")){
                                    $(this).parents("tr").remove();
                                }
                            });
                        });
                        
                        
                        
                        
                        // Find and remove selected table rows
                        $("#deleteSensorThreshold").click(function(){
                            $("#sensorThresholdTable").find('input[name="record"]').each(function(){
                            	if($(this).is(":checked")){
                                    $(this).parents("tr").remove();
                                }
                            });
                        });
                        

                        var sensorRelation='AND';

                       

                        
		                    
		              $("#submit").click(function(){
		            	  
		            	 
		            	  var description =$("#description").val();
		            	  
		  				  var submitData =  JSON.stringify(
			                        {"description":description,"reactorIds":reactorIds,"sensorIds":sensorIds,"reactorCommands":reactorCommands,"sensorRelation":sensorRelation,"sensorThreshold":sensorThreshold,"sensorThresholdRelation":sensorThresholdRelation}
		                    );
		            	  
		            	  alert(submitData);
		            	  
		            	  
		            	  submitLogic('/IoTService/addLogic',submitData,"#response") 

	                 });
	                      
                        
  
                    });
                    
                </script>
            </head>
            <body>
					
                    <form class="smart-green">
                        <h1>IoTService -- Add Logic
                              <span>Please fill all the texts in the fields.</span>
                        </h1>
       
                        <label>
                              <span>Description :</span>        
                               <input type="text" id="description" placeholder="Description" />
                        </label>
                                      


                    	 <label>
                            <span>SensorId :</span> 
                            <select id="selectedSensorIds"></select>
                         </label>                       

                         <label>
                          	<span>Relation :</span>
                            <select id="selectedRelations">
                            	<option value="GT">Great than</option>
	       						<option value="LT">Less than</option>
	       						<option value="E">Equal to</option>
	       				   </select>
                        	
                          </label> 

                          <label>
                          	<span>Threshold :</span>
                          	<input type="text" id="thresholdValue" placeholder="Threshold Value"></input>
                          </label>
                            
                            
                          <input type="button" id="addSensorThreshold" value="Add Sensor Threshold">
                          
                          <table id="sensorThresholdTable">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>SensorId</th>
                                        <th>Relation</th>
                                        <th>Threshold Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                        	</table>
                        <!-- 
                         <input type="button" id="deleteSensorThreshold" value="Remove Sensor Threshold">
   						-->

                    
                         <label>
                            <span>ReactorId :</span> 
                            <select id="selectedReactorIds"></select>
                         </label> 
                         
                         <label>
                         	<span>Command : </span>
                            <input type="text" id="reactorCommand" placeholder="Reactor Command">
                       	 </label>
                    	
                         <input type="button" id="addReactorCommand" value="Add Reactor Command">
                         
                         <table id="reactorCommandTable">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Reactor</th>
                                        <th>Command</th>
                                    </tr>
                                </thead>
                                <tbody>
                               </tbody>
                        </table>
                         <!-- 
                         <input type="button" id="deleteReactorCommand" value="Delete Reactor Command">
                         -->
                         
                        <label>
	                        <span></span>
                            <input type="button" id ="submit" value="Send" />
                        </label>
                    </form>

                    <form class="smart-green">
                    
                        <label>
                                
                                <span>Response: </span>
                                
                                <textarea id="response" placeholder="Response JSON"></textarea>
                        </label>
                    </form>
            </body>

</html>