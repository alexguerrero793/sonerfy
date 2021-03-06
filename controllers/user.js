'user strict'

var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');



function pruebas(req, res){
    res.status(200).send({
        message: 'PROBANDO API REST CON NODO Y MONGO'
    });
}

function saveUser(req, res){

    var user = new User();
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //ENCRIPTAR CONTRASEÑA
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surmane != null && user.email != null){
                //GUARDAR USUARIO BASE DATOS
                user.save((err, userStored) =>{
                    if(err){
                        res.status(500).send({message: 'Error al guardar'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha guardado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Rellena todos los campos'});
            }
        });
    }else{
        res.status(200).send({message: 'Introduce la contraseña'});
    }
}


//LOGIN 

function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({message: 'Usuario no existe'});
            }else{
                //COMPROBAR CONTRASEÑA
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //devolver datos usuario logeado
                        if(params.gethash){
                            //devolver un toquen de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'Usuario no ha podido loguearse'});
                    }
                });
            }
        }
       
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if(!userUpdated){
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res){
    var userId = req.param.id;
    var file_name = 'No subido..';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_path.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image:file_name}, (err, userUpdated) =>{
                if(!userUpdated){
                    res.status(404).send({message: 'Error al actualizar el usuario'});
                }else{
                    res.status(404).send({user: userUpdated});
                }
            });

        }else{
            res.status(200).send({message: 'Extensión no es correcta'}); 
        }

    }else{
        res.status(200).send({message: 'No hay imagen'});
    }
}

function getImageFile (req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file+imageFile, function(exists){
        if(exists){
           res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen..'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};