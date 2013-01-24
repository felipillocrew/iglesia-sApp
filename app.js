var express = require('express'),
mongo = require('./mongoDB'),
connect = require('connect'),
MemoryStore = connect.session.MemoryStore;

var app = module.exports = express.createServer();
var usr = mongo.Usuarios;
var ips = mongo.Ips;


var minute = 60 * 1000;


// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
      
    app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser('foobar'));
	app.use(connect.cookieParser('foobar'));
	app.use(express.methodOverride());
	app.use(express.session({store: MemoryStore({reapInterval: minute, maxAge: minute * 5}), secret:'foobar'}));
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true,  showStack: true })); 
});
app.configure('production', function(){
	app.use(express.errorHandler()); 
});




var SaveVisit = function(req, res, usrID){
	var data = { 'ip': req.connection.remoteAddress, 'ts': new Date() };
	new ips(data).save(function(error, data){
	    if(error){
	        console.info(error);
	    }
	    else{
	        console.info(data);
	    }
	});
}

app.get('/', function(req, res){
	res.render('index.jade', {title: 'Login'});
});



app.post('/login', function(req, res){
	var user = req.param("user")
	var pass = req.param("pass")

	usr.findOne({"usuario" : user, "clave" : pass},function(e,data) {
		console.info('error: ' + e);
		console.info('obj: ' + data);
		if (data) {
			req.session.name = data.usuario;
			SaveVisit(req, res,data._id);
			res.redirect("/ip")
		} else {
			res.redirect("/")
		}
	});
});



app.get('/logout', function(req, res){
	req.session.destroy(function(err) {
	   res.redirect("/")
	})
});

app.get('/', function(req, res) {
    res.send('Hello');
});

app.get('/ip',function (req, res) {
 	if (req.session.name == undefined) {
        res.redirect("/")
    } 
    else {
    	res.send('Bienvenido');
    }
});

app.listen(process.env.VCAP_APP_PORT || 3000);
