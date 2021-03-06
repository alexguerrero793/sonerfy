'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
    res.status(200).send({message: 'mdndnd'});
}


function saveArtist(req, res){
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.sabe((er, artistStores) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'Error al guardar el artista'});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }
    });
}



module.exports = {
    getArtist,
    saveArtist
};