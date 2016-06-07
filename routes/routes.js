module.exports = function(express,app,io,fs,exec){

    var router = express.Router();
    router.get('/',function(req,res,next){
        res.render('schematic',{});

    });
    
    app.use('/',router);
    
   
    io.on('connection',function(socket){
    	var socketId = getSocketID(socket);
    	var analysisFile = '/tmp/' + socketId + '.cir.out';
    	//Conversion to lower case is required as NgSpice internally converts the filename to lower case.
    	var dumpv = '/tmp/' + socketId.toLowerCase() + '-dumpv.txt';
    	var dumpi = '/tmp/' + socketId.toLowerCase() + '-dumpi.txt';
	    
	    console.log('Client with socket id ' + socketId + ' is now connected.');

		
		socket.on('disconnect', function(){
			console.log('Client with socket id ' + socketId + ' has disconnected.');
			deleteOnExit(analysisFile);
			deleteOnExit(dumpv);
			deleteOnExit(dumpi);
		});


		socket.on('netlist', function(msg){
			//Replacing to be created filenames in the generated netlist, so as to identify the client
	  		var update = msg.replace('dumpv.txt', dumpv);
	  		var result = update.replace('dumpi.txt', dumpi);

      		fs.writeFile(analysisFile, result, function(err){
      			if(err){
      				return console.log(err);
      			}
      		});

      		executeNgspiceNetlist(analysisFile);
		});
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
								break;
						}
					}
				});
			}
	 	});
				
	}



}

