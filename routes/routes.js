module.exports = function(express,app){

    var router = express.Router();
    router.get('/',function(req,res,next){
        res.render('schematic',{});

    });
    
    app.use('/',router);


}

