module.exports = function(express,app,io,fs,exec){

    var router = express.Router();
    router.get('/',function(req,res,next){
        res.render('schematic',{});

    });
    
    app.use('/',router);
    

    io.on('connection',function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
		fs.stat('/tmp/' + socket.id + '.cir.out', function(err, stat){
			if(err == null){
				fs.unlink('/tmp/' + socket.id + '.cir.out');
			}
		
		});
		fs.stat('/tmp' + socket.id.toLowerCase() + '-dumpv.txt', function(err, stat){
			if(err == null){
				fs.unlink('/tmp' + socket.id.toLowerCase() + '-dumpv.txt');
			}
		
		});
		fs.stat('/tmp' + socket.id.toLowerCase() + '-dumpi.txt', function(err, stat){
			if(err == null){
				fs.unlink('/tmp' + socket.id.toLowerCase() + '-dumpi.txt');
			}
		
		});
					
	});
	socket.on('chat message', function(msg){
      console.log('message: ' + msg);
	});
	socket.on('netlist', function(msg){
	  var update = msg.replace('dumpv', '/tmp' + socket.id.toLowerCase() + '-dumpv');
	  var result = update.replace('dumpi', '/tmp' + socket.id.toLowerCase() + '-dumpi');
      fs.writeFile('/tmp/' + socket.id + '.cir.out', result, function(err){
      	if(err){
      		return console.log(err);
      	}
      });
      exec('ngspice ' + '/tmp/' + socket.id + '.cir.out');


	});
});

}

