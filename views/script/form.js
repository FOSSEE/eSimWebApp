var socket = io();

socket.on("plotData",function(data){
	var keys = Object.keys(data);
	var traceObj = {};
	var traces = [];


	console.log(Object.keys(data));

	//Dynamically creating traces
	for(var i=0; i<keys.length; i++){
		if(keys[i]=='x-axis'){
			continue;
		}
		else{
			var trace = {
				x: data['x-axis'],
				y: data[keys[i]],
				name:keys[i],
				type: 'scatter'
			};
			traceObj[keys[i]] = trace;
		}
	}

	var traceKey = Object.keys(traceObj);

	for (var i=0;i<traceKey.length;i++) {
  		var value = traceObj[traceKey[i]];
  		traces.push(value);
	}
	
	console.log("traces :"+traces);
			
	var dataForPlotly = traces;
		
	var layout = {
		title:'Simulation Output',
		yaxis: { title: "Voltage(Volts) / Current(Amp)"},      // set the y axis title
		xaxis: {
			title:"time(Sec) / Frequency(Hz)",
			showgrid: true                 // remove the x-axis grid lines
		},
    	margin: {                           // update the left, bottom, right, top margin
    		l: 40, b: 25, r: 10, t: 25
    	}
    };

    Plotly.newPlot(document.getElementById('webtronics_graph_display'), dataForPlotly, layout);
   


})