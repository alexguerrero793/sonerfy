'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta'

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({menssage: 'la petición no tiene la autenticación'});
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({menssage: 'Token ha expirado'});
        }
    }catch(ex){
        console.log(ex);
        return res.status(404).send({menssage: 'Token no válido'});
    }

    req.user = payload;
    next();
};