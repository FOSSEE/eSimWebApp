var socket = io();

socket.on("plotData",function(data){
	var keys = Object.keys(data);
	var traceObj = {};
	var traces = [];
	


	$('webtronics_plot_keys').innerHTML = "Available keys: " + Object.keys(data);
		
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
	
			
	var dataForPlotly = traces;

	var layout = {
		title:'Simulation Output',
		yaxis: { title: "Voltage(Volts) / Current(Amp)"},      // set the y axis title
		xaxis: {
			title:"time(Sec) / Frequency(Hz)",
			showgrid: true                 // remove the x-axis grid lines
		},
    	margin: {                           // update the left, bottom, right, top margin
    		l: 60, b: 35, r: 10, t: 25
    	}
    };

    Plotly.newPlot(document.getElementById('webtronics_graph_display'), dataForPlotly, layout);


	jQuery("#plot_graph").click(function(){
		var traceObj = {};
		var traces = [];
		var abscissa, ordinate;
		abscissa = $('abscissa_value').value;
		ordinate = $('ordinate_value').value;
		if(abscissa == "" || ordinate == ""){
			alert("PLease enter values to plot graph");
		}
		else{
			var flag = 0;
			for(var i=0; i<keys.length; i++){
				if(keys[i]==ordinate){
					flag=1;
					var trace = {
						x: data[abscissa],
						y: data[keys[i]],
						name: keys[i],
						type: 'scatter'
					};
					traceObj[keys[i]] = trace;
				}
		
			}

			if(flag == 0){
			alert("Invalid inputs");
			}
			else{
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
    					l: 60, b: 35, r: 10, t: 25
    				}
  				};
  	 			Plotly.newPlot(document.getElementById('webtronics_graph_display'), dataForPlotly, layout);
			}
		}
	
	});
	
})