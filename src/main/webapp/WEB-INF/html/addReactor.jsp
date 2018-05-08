<html>
        <head>
                <title>IoTService ---Add Reactor</title>
                <link rel="stylesheet" type="text/css" href="../styles/style.css"/>
                <script type="text/javascript" src="../scripts/jquery.min.js"></script>
                <script type="text/javascript" src="../scripts/iotService.js"></script>
                
                <script type="text/javascript">
                    $(document).ready(function(){
               			
                                            	
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
                      	  var pubTopic = $("#pubTopic").val();
                      	  var location = $("#location").val();
                      	  
                      	  
                      	  var reqJSON = JSON.stringify(
                      			{"name":name,"description":description,"location":location,"pubMqttTopic":pubTopic,"commandList":reactorCommands},undefined, 2	  
                      	  );
                      	  $("#request").val(reqJSON);
                      	  
                      	  
                        });
                        
                        
		                    
		              $("#submit").click(function(){
		            	  
                      	  var name = $("#name").val();
                      	  var description = $("#description").val();
                      	  var pubTopic = $("#pubTopic").val();
                      	  var location = $("#location").val();
		  				  
                      	  var submitData =  JSON.stringify(
		  						{"name":name,"description":description,"location":location,"pubMqttTopic":pubTopic,"commandList":reactorCommands},undefined, 2	  
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
                              <span>Loaction :</span>        
                               <input type="text" id="location" placeholder="Location" />
                        </label>
                   


		                <label>
		                      <span>MQTT Publish Topic :</span> 
		                      <input type="text" id="pubTopic" placeholder="MQTT Publish Topic" />
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