<html>
<head>
<title>IoT Temperature Sensor</title>
 
<script type="text/javascript" src="../scripts/jquery.min.js"></script>
<script type="text/javascript" src="http://static.fusioncharts.com/code/latest/fusioncharts.js"></script>
<!--
<script type="text/javascript" src="../../fusioncharts.js"></script>
-->
<script type="text/javascript" src="http://static.fusioncharts.com/code/latest/themes/fusioncharts.theme.fint.js?cacheBust=56"></script>
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

	
	function loadSensorOption(dataArray,htmlItem){
		
		for (var key in dataArray){
			//alert(Object.values(dataArray[key]));
			$(htmlItem).append($("<option/>", {
				
				value: dataArray[key].id,
				text: key+"----"+dataArray[key].description
			}));
		};
	}

    FusionCharts.ready(function(){
    	
    var sensorList =loadObjectMap('/IoTService/listSensor'); 	
    loadSensorOption(sensorList,'#selectedSensorIds');	
    	
    var fusioncharts = new FusionCharts({
    type: 'thermometer',
    renderAt: 'chart-container',
    width: '340',
    height: '510',
    dataFormat: 'json',
    dataSource: {
        "chart": {
            "caption": "Temperature Monitor",
            "subcaption": " Source My IoT Platform",
            "lowerLimit": "5",
            "upperLimit": "30",
 
            "decimals": "1",
            "numberSuffix": "°C",
            "showhovereffect": "1",
            "thmFillColor": "#008ee4",
            "showGaugeBorder": "1",
            "gaugeBorderColor": "#008ee4",
            "gaugeBorderThickness": "2",
            "gaugeBorderAlpha": "50",
            "thmOriginX": "100",
            "chartBottomMargin": "20",
            "valueFontColor": "#000000",
            "theme": "fint"
        },
        "value": "16",
        //All annotations are grouped under this element
        "annotations": {
            "showbelow": "0",
            "groups": [{
                //Each group needs a unique ID
                "id": "indicator",
                "items": [
                    //Showing Annotation
                    {
                        "id": "background",
                        //Rectangle item
                        "type": "rectangle",
                        "alpha": "50",
                        //"fillColor": "#AABBCC",
                        //"x": "$gaugeEndX-40",
                        //"tox": "$gaugeEndX",
                        //"y": "$gaugeEndY+54",
                        //"toy": "$gaugeEndY+72"
                    }
                ]
            }]
 
        },
    },
    "events": {
        "rendered": function(evt, arg) {
            evt.sender.dataUpdate = setInterval(function() {
                var value,
              	prevTemp = evt.sender.getData();
                
                var tempSensorId = $("#selectedSensorIds").val();
                    $.ajax({
                            crossDomain: true,
                            dataType: 'json',
                            url: "/IoTService/getSensorCurrentData?sensorId="+tempSensorId,
                            async:false,
                            success: function(jsondata){
                                   // alert(jsondata.currentData);
                                  value = jsondata.sensorCurrentData;
                            }
                         }
                     );
                                                         
                evt.sender.feedData("&value=" + value);
 
            }, 2000);
            updateAnnotation = function(evtObj, argObj) {
                var code,
                    chartObj = evtObj.sender,
                    val = chartObj.getData(),
                   annotations = chartObj.annotations;
 
                if (val >= -4.5) {
                    //code = "#00FF00";
                } else if (val < -4.5 && val > -6) {
                    //code = "#ff9900";
                } else {
                    //code = "#ff0000";
                }
               // annotations.update("background", {
                    //"fillColor": code
                //});
            };
        },
        'renderComplete': function(evt, arg) {
            updateAnnotation(evt, arg);
        },
        'realtimeUpdateComplete': function(evt, arg) {
            updateAnnotation(evt, arg);
        },
        'disposed': function(evt, arg) {
            clearInterval(evt.sender.dataUpdate);
        }
    }
}
);
    fusioncharts.render();
    });
</script>
</head>
<body>
	<label>
        <span>SensorId :</span>
        <select id="selectedSensorIds"></select>
    </label>
    <div id="chart-container"/>
</body>
</html>