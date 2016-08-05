module.exports = function(express,app,io,fs,exec,os,PythonShell,scriptPath){

    var router = express.Router();
    var pyEnv = '/usr/bin/python';

    router.get('/',function(req,res,next){
        res.render('schematic',{});

    });
    
    app.use('/',router);
    
   
    io.on('connection',function(socket){
    	var socketId = getSocketID(socket);
    	var fileName = '/tmp/' + socketId + '.cir.out';
    	//Conversion to lower case is required as NgSpice internally converts the filename to lower case.
    	var dumpv = '/tmp/' + socketId.toLowerCase() + '-dumpv.txt';
    	var dumpi = '/tmp/' + socketId.toLowerCase() + '-dumpi.txt';
	    
	    console.log('Client with socket id ' + socketId + ' is now connected.');

		
		socket.on('disconnect', function(){
			console.log('Client with socket id ' + socketId + ' has disconnected.');
			deleteOnExit(fileName);
			deleteOnExit(dumpv);
			deleteOnExit(dumpi);
		});


		socket.on('netlist', function(msg){
			//Replacing to be created filenames in the generated netlist, so as to identify the client
	  		var update = msg.replace('dumpv.txt', dumpv);
	  		var result = update.replace('dumpi.txt', dumpi);

      		fs.writeFile(fileName, result, function(err){
      			if(err){
      				return console.log(err);
      			}
      		});

      		executeNgspiceNetlist(fileName);
		});

    function deleteOnExit(filename){
    	fs.stat(filename, function(err, stat){
			if(err == null){
				fs.unlink(filename);
				console.log('File: ' + filename + ' deleted.')
			}
			else
				console.log('Unable to delete file : ' + filename + '\n' + err );
    	});
    }

    function getSocketID(socket){
			socketID = socket.id;
			//Removing first two char i.e '/#' from socket id
			socketID = socketID.substring(2);
			console.log("Return :"+socketID)
			return socketID;
	}


	function executeNgspiceNetlist(fileName)
	{
		fs.exists(fileName, function(exists) {
			if (exists) {
				exec('ngspice '+fileName, function(code, stdout, stderr) {
  					console.log('Exit code:', code);
  					console.log('Program output:', stdout);
  					console.log('Program stderr:', stderr);

					if(stderr){
						switch(stderr){
							case (stderr.match(/Error/) || stderr.match(/error/)||{}).input:
								console.log("Error in executing ngspice netlist");        
								socket.emit('serverMessage','Error while executing ngspice netlist: '+stderr);	
								break;
							default:
								parsePlotData();
								break;
						}
					}

					else
						parsePlotData();
				});
			}
	 	});
				
	}

	function parsePlotData()
	{
		console.log("Ngspice netlist executed successfully ");
		socket.emit('serverMessage','Ngspice netlist executed successfully: ');	
		var analysisInfo = grep('.tran|.dc|.ac', fileName);
		console.log("Analysis :"+analysisInfo);
		console.log("Plot Allv :"+dumpv);
		console.log("Plot Alli :"+dumpi);
		
		var options = {
			mode: 'json',
			pythonPath: pyEnv,
			pythonOptions: ['-u'],
 			scriptPath: scriptPath,
  			args: [analysisInfo, dumpv, dumpi]
		};

 		PythonShell.run('parser.py', options, function (err, results) 
 		{
 			if (err) throw err;
  			// results is an array consisting of messages collected during execution 
 			//console.log('results: %j', results);
 			var resultString = results[0];
 			//console.log(resultString);
 			//Emitting Data Points to client
			socket.emit('plotData',resultString);
 	    });
	}

});


}

