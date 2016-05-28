var express = require('express'),
    path = require('path'),
    config = require('./config/config.js')


    var app = express();
app.set('views',path.join(__dirname,'views'));
app.engine('html',require('hogan-express'));
app.set('view engine','html');

app.use(express.static(path.join(__dirname,'views')));

app.set('port',process.env.PORT||4000);

//Setting config
app.set('host',config.host);

//Routing
require('./routes/routes.js')(express,app);

//Socket IO
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

server.listen(app.get('port'),function(){
        console.log('eSim Runing on port : '+app.get('port'));
});

io.on('connection',function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
		fs.stat('/tmp/socket_id.cir.out', function(err, stat){
			if(err == null){
				fs.unlink('/tmp/socket_id.cir.out');
				console.log('temp file deleted successfully');
			}
		
		});
					
	});
	socket.on('chat message', function(msg){
      console.log('message: ' + msg);
	});
	socket.on('netlist', function(msg){
		console.log('netlist stored in tmp folder')
      fs.writeFile('/tmp/socket_id.cir.out', msg, function(err){
      	if(err){
      		return console.log(err);
      	}
      });
	});
	io.emit('chat message', {hello: 'world'});
})



