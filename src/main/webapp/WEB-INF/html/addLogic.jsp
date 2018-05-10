<html>
        <head>
                <title>IoTService ---Add Logic</title>
                <link rel="stylesheet" type="text/css" href="../styles/style.css"/>
                <script type="text/javascript" src="../scripts/jquery.min.js"></script>
                
                <script type="text/javascript">
				
					var sensorIds=[];
                    var sensorThreshold=[];
                    var sensorThresholdRelation=[];
					var reactorIds=[];
					var reactorCommands=[];
				
					 function loadObjectMap(url){
						
						var objectMap = {};
									 
							$.ajax({
								crossDomain: true,
								dataType: 'json',
								url: url,
								async:false,
								success: function(listData){
									
									for (var i in listData)
									{
										objectMap[listData[i].id]=listData[i];
									}
									
								  }
								}
							);
							return objectMap;
					}

					function loadSensorOption(dataArray,htmlItem){
		
						for (var key in dataArray){
							//alert(Object.values(dataArray[key]));
							$(htmlItem).append($("<option/>", {
								
								value: dataArray[key].id,
								text: key+"----"+dataArray[key].description
							}));
						};
					}
				
					function loadReactorOption(dataArray,htmlItem){
		
						for (var key in dataArray){
							//alert(Object.values(dataArray[key]));
							$(htmlItem).append($("<option/>", {
								
								value: dataArray[key].id+"|"+dataArray[key].commandList,
								text: key+"----"+dataArray[key].description
							}));
						};
					}
				
					function loadCommandOption(commandList, htmlItem){
						
						for(var i in commandList){
							$(htmlItem).append($("<option/>", {
								value: commandList[i],
								text: commandList[i]
							}));
						}						
					}
				
				
					function selectReactor(htmlItem){
						 var commandList = $("#selectedReactorIds").val().split('|')[1].split(',');
						 //alert(commandList);
						 loadCommandOption(commandList,htmlItem);
					}
				
					function addSensorThreshold(){
					
						var sensorId = $("#selectedSensorIds").val();
                        var sensorRelation = $("#selectedRelations").val();
                        var thresholdValue = $("#thresholdValue").val();
                        var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + sensorId + "</td><td>" + sensorRelation + "</td><td>" + thresholdValue + "</td></tr>";
                        sensorIds.push(sensorId);
                        sensorThresholdRelation.push(sensorRelation);
                        sensorThreshold.push(thresholdValue);
                        $("#sensorThresholdTable").append(markup)
					
					}
					
					
					function addReactorCommand(){
					
						var reactorId = $("#selectedReactorIds").val().split('|')[0];
                        var reactorCommand = $("#selectedCommand").val();
                        var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + reactorId + "</td><td>" + reactorCommand + "</td></tr>";
                        reactorIds.push(reactorId);
                        reactorCommands.push(reactorCommand);
                        $("#reactorCommandTable").append(markup);
					}
				
					
					
					
					

					
					
					
					function generateSubmitJSON(){
						
						var description = $("#description").val();
						
						var reqJSON =JSON.stringify( 
						
						{"description":description,"sensorIds":sensorIds,"reactorIds":reactorIds,"sensorRelation":"AND","sensorThreshold":sensorThreshold,"sensorThresholdRelation":sensorThresholdRelation,"reactorCommands":reactorCommands }
						,undefined, 2);
						
						return reqJSON;
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
					
					
					
                    $(document).ready(function(){
                        var jsondata = new Object();

						
						var sensorList =loadObjectMap('/IoTService/listSensor');
						var reactorList =loadObjectMap('/IoTService/listReactor');
						loadSensorOption(sensorList,'#selectedSensorIds');
						$("#selectedSensorIds")[0].selectedIndex = -1;						
						loadReactorOption(reactorList,'#selectedReactorIds');
						$("#selectedReactorIds")[0].selectedIndex = -1
						
						$('#selectedReactorIds').change(function() {
							selectReactor('#selectedCommand');
						})
						
						$("#addSensorThreshold").click(function(){
							addSensorThreshold();
						})
						
						$("#addReactorCommand").click(function(){
							addReactorCommand();
                        });
	                    $("#displayReqJSON").click(function(){
	                    	var reqJSON =generateSubmitJSON();
	                    	$("#request").val(reqJSON);
	                    });
	                    
	                    $("#submit").click(function(){
	                    	var reqJSON =generateSubmitJSON();
	                    	submitLogic('/IoTService/addLogic',reqJSON,"#response");
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
							<select id="selectedCommand"></select>
							<!--
								<input type="text" id="reactorCommand" placeholder="Reactor Command">
							-->
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
                          	<input type="button" id="displayReqJSON" value="Display Request JSON">
						 </label>
                         
                         <label>
                                
                            <span>Request JSON: </span>
                                
                            <textarea id="request" placeholder="Request JSON"></textarea>
                        </label>
                         
                         
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
