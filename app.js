var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js')


    var app = express();
app.set('views',path.join(__dirname,'views'));
app.engine('html',require('hogan-express'));
app.set('view engine','html');

app.use(express.static(path.join(__dirname,'views')));
app.use(cookieParser());
app.use(session({secret:'esimSession',
                resave: true,
                saveUninitialized: true
                }));
app.set('port',process.env.PORT||4000);

//Setting config
app.set('host',config.host);

//Routing
require('./routes/routes.js')(express,app);

//Socket IO
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(app.get('port'),function(){
        console.log('eSim Runing on port : '+app.get('port'));
})

