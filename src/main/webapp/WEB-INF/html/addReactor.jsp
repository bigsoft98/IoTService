<html>
        <head>
                <title>IoTService ---Add Reactor</title>
                <link rel="stylesheet" type="text/css" href="../styles/style.css"/>
                <script type="text/javascript" src="../scripts/jquery.min.js"></script>
                <script type="text/javascript" src="../scripts/iotService.js"></script>
                
                <script type="text/javascript">
                    $(document).ready(function(){
               			

                    	$("#mqttInfo").hide();
                    	$("#httpInfo").hide();
                        $('#selectedCommunicationChannle').val('');
                        $("#pubHttpMethod").val('');
                        
                        $("#selectedCommunicationChannle").change(function() {
                      	  if($("#selectedCommunicationChannle").val()=="mqtt" ){
                      		  $("#mqttInfo").show();
                      		  $("#httpInfo").hide();
	                      	  $("#pubHttpUrl").val('');
	                      	  $("#pubHttpMethod").val('');
                      	  }else if($("#selectedCommunicationChannle").val()=="http"){
                      		  $("#mqttInfo").hide();
                      		  $("#httpInfo").show();
                      		  $("#pubTopic").val('');
                      	  }
                      	});
                    	
                        
                        
	                	var reactorCommands=[];
	                        
	                        $("#addReactorCommand").click(function(){
	                            var reactorCommand = $("#reactorCommand").val();
	                            var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + reactorCommand + "</td></tr>";	           
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
                        
                        
                        
                        
   
                        $("#displayReqJSON").click(function(){
                       	 
                      	  var name = $("#name").val();
                      	  var description = $("#description").val();
                      	  var comChannel =$("#selectedCommunicationChannle").val();
                      	  var pubTopic = $("#pubTopic").val();
                      	  var pubHttpUrl = $("#pubHttpUrl").val();
                      	  var pubHttpMethod = $("#pubHttpMethod").val();
                      	  
                      	  
                      	  var reqJSON = JSON.stringify(
                      			{"name":name,"description":description,"communicateChannel":comChannel,"pubMqttTopic":pubTopic,"pubHttpUrl":pubHttpUrl,"pubHttpMethod":pubHttpMethod,"commandList":reactorCommands},undefined, 2	  
                      	  );
                      	  $("#request").val(reqJSON);
                      	  
                      	  
                        });
                        
                        
		                    
		              $("#submit").click(function(){
		            	  
                      	  var name = $("#name").val();
                      	  var description = $("#description").val();
                      	  var comChannel =$("#selectedCommunicationChannle").val();
                      	  var pubTopic = $("#pubTopic").val();
                      	  var pubHttpUrl = $("#pubHttpUrl").val();
                      	  var pubHttpMethod = $("#pubHttpMethod").val();
		            	  
		  				  var submitData =  JSON.stringify(
		  						{"name":name,"description":description,"communicateChannel":comChannel,"pubMqttTopic":pubTopic,"pubHttpUrl":pubHttpUrl,"pubHttpMethod":pubHttpMethod,"commandList":reactorCommands},undefined, 2	  
		  				 );
		            	  
		            	  
		            	  
		            	  
		            	  submitLogic('/IoTService/addReactor',submitData,"#response") 

	                 });
	                      
                     	              
		              
  
                    });
                    
                </script>
            </head>
            <body>
					
                    <form class="smart-green">
                        <h1>IoTService -- Add Reactor
                              <span>Please fill all the texts in the fields.</span>
                        </h1>
                        
                        <label>
                              <span>Name :</span>        
                               <input type="text" id="name" placeholder="Name" />
                        </label>
       
                        <label>
                              <span>Description :</span>        
                               <input type="text" id="description" placeholder="Description" />
                        </label>
                                      


                         <label>
                          	<span>Communication Channel :</span>
                            <select id="selectedCommunicationChannle">
                            	<option value="mqtt">MQTT</option>
	       						<option value="http">HTTP</option>
	       				   </select>
                        	
                          </label>                      

							<div id='mqttInfo'>
		                    	 <label>
		                            <span>MQTT Publish Topic :</span> 
		                            <input type="text" id="pubTopic" placeholder="MQTT Publish Topic" />
		                         </label>  
	                         </div>
	                         
	                         <div id='httpInfo'>
	                         	<label>
                              		<span>HTTP Publish URL :</span>        
                               		<input type="text" id="pubHttpUrl" placeholder="HTTP Publish URL" />
                        		</label>

	                         	<label>
                              		<span>HTTP Publish Method :</span>
                                 
                               		<select id="pubHttpMethod" placeholder="HTTP Publish Method" >
                               			<option value="post">POST</option>
                               			<option value="put">GET</option>
                               		</select>
                        		</label>
	                         </div>
	                       
	                       
	                       
	                      
	                      
	                     <label>
                         	<span>Command : </span>
                            <input type="text" id="reactorCommand" placeholder="Reactor Command">
                       	 </label>
                    	
                         <input type="button" id="addReactorCommand" value="Add Reactor Command">
                         
                         <table id="reactorCommandTable">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Command</th>
                                    </tr>
                                </thead>
                                <tbody>
                               </tbody>
                        </table>
	                      
	                                             
                         <!--  input type="button" id="deleteReactorCommand" value="Delete Reactor Command" -->
                  			
	                       
	                         
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