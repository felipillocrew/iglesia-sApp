var mongoose = require('mongoose'),
schema = mongoose.Schema;

var IPS = new schema({
    ip : String,
    usr: mongoose.Schema.Types.ObjectId,
    ts: Date
  }),
USUARIOS = new schema({
  nombre:  {type: String, required: true},
  apellido: {type: String, required: true},
  correo: {type: String,default: null},
  usuario: {type: String, required: true, unique: true, index: true},
  clave: {type: String, required: true},
  grupoid: {type: Number, default: 0},
  usertype: {type: Number, default: 0},
  activo : {type: Number, default: 0},
  uc : {type: String, required: true},
  fc : {type: Date,  default: Date.now}
});
  
var db = mongoose.connect(process.env.MONGO_1 || "mongodb://localhost:27017/iglesia");
var Ips = exports.Ips = mongoose.model('IPS', IPS),
Usuarios = exports.Usuarios = mongoose.model('USUARIOS', USUARIOS);

// Add a default user cbarba
Usuarios.find({ usuario: 'cbarba' },function(err, docs){	
	if (docs.length == 0) {
		var usr = new Usuarios();
		usr.nombre=  "Cristobal";
		usr.apellido= "Barba";
		usr.usuario= "cbarba";
		usr.clave= "c706180t";
		usr.activo= 1;
		usr.uc= "sys";
		usr.save(function() {
			console.info("Saved user cbarba");
		});
	} else {
		console.info("User cbarba already exists");
	}
});