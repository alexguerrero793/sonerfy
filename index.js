'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/proyecto_fy', (err, res) =>{
    if(err){
        throw err;
    }else{
        console.log("Va bien..");

        app.listen(port, function(){
            console.log("Server API REST http://localhost:"+port);
        });
    }
});