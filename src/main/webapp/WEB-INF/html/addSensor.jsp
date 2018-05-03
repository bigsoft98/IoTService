<html>
        <head>
                <title>IoTService ---Add Sensor</title>
                <link rel="stylesheet" type="text/css" href="../styles/style.css"/>
                <script type="text/javascript" src="../scripts/jquery.min.js"></script>
                <script type="text/javascript" src="../scripts/iotService.js"></script>
                
                <script type="text/javascript">
                    $(document).ready(function(){
               			
                      var reqJson;
                      
                      $("#mqttInfo").hide();
                      $('#selectedCommunicationChannle').val('');
                      
                      $("#selectedCommunicationChannle").change(function() {
                    	  if($("#selectedCommunicationChannle").val()=="mqtt" ){
                    		  $("#mqttInfo").show();
                    	  }else{
                    		  $("#mqttInfo").hide();
                    		  $("#subTopic").val('');
                    	  }
                    	});
                    	
                      $("#displayReqJSON").click(function(){
                    	 
                    	  var name = $("#name").val();
                    	  var description = $("#description").val();
                    	  var comChannel =$("#selectedCommunicationChannle").val();
                    	  var subTopic = $("#subTopic").val();
                    	  
                    	  var reqJSON = JSON.stringify(
                    			{"name":name,"description":description,"communicateChannel":comChannel,"subMqttTopic":subTopic},undefined, 2	  
                    	  );
                    	  $("#request").val(reqJSON);
                    	  
                    	  
                      });
	                    
		              $("#submit").click(function(){
		            	  
		            	 
		            	  var name = $("#name").val();
                    	  var description = $("#description").val();
                    	  var comChannel =$("#selectedCommunicationChannle").val();
                    	  var subTopic = $("#subTopic").val();
		            	  
		  				  var submitData =  JSON.stringify(
		  						{"name":name,"description":description,"communicateChannel":comChannel,"subMqttTopic":subTopic}
		  				  );
		            	  
		            	  submitLogic('/IoTService/addSensor',submitData,"#response");
		            	 

	                 });
	                      
                        
  
                    });
                    
                </script>
            </head>
            <body>
					
                    <form class="smart-green">
                        <h1>IoTService -- Add Sensor
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
                            <span>MQTT Subscribe Topic :</span> 
                            <input type="text" id="subTopic" placeholder="MQTT Subscribe Topic" />
                         </label>                       
                      
                      </div>
                      
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