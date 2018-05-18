<html>
        <head>
                <title>IoTService ---Send Command To Reactor</title>
                <link rel="stylesheet" type="text/css" href="../styles/style.css"/>
                <script type="text/javascript" src="../scripts/jquery.min.js"></script>
                
                <script type="text/javascript">
				

				
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
						$(htmlItem).empty();
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
				
				
					function generateSubmitJSON(){
						
						var selectedReactorId = $("#selectedReactorIds").val().split('|')[0];
						
						var selectedCommand = $("#selectedCommand").val();
						
						var reqJSON =JSON.stringify( 
						
						{"reactorId":selectedReactorId,"command":selectedCommand }
						,undefined, 2);
						
						return reqJSON;
					}
					
					
					
					function submitCommand(url,responseElement){
						
						$.ajax({
							
							  url: url,
							  type: 'GET',
							  cache: 'false',
							  contentType: false,
							  //data: logicData,
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

						var reactorList =loadObjectMap('/IoTService/listReactor');					
						loadReactorOption(reactorList,'#selectedReactorIds');
						$("#selectedReactorIds")[0].selectedIndex = -1
						
						$('#selectedReactorIds').change(function() {
							selectReactor('#selectedCommand');
						})
						

	                    $("#displayReqJSON").click(function(){
	                    	var reqJSON =generateSubmitJSON();
	                    	$("#request").val(reqJSON);
	                    });
	                    
	                    $("#submit").click(function(){
	                    	//var reqJSON =generateSubmitJSON();
	                    	//alert(reqJSON);
	                    	var selectedReactorId = $("#selectedReactorIds").val().split('|')[0];
							var selectedCommand = $("#selectedCommand").val();
							
							submitCommand('/IoTService/sendReactorCommand?reactorId='+selectedReactorId+'&command='+selectedCommand,"#response");
	                    });
						
                    });
                    
                </script>
            </head>
            <body>
					
                    <form class="smart-green">
                        <h1>IoTService -- Send Command to Reactor
                              <span>Please fill all the texts in the fields.</span>
                        </h1>
       

                    
                         <label>
                            <span>ReactorId :</span> 
                            <select id="selectedReactorIds"></select>
                         </label> 
                         
                         <label>
                         	<span>Command : </span>
							<select id="selectedCommand"></select>
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
