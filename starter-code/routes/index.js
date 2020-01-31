const {Router}=require("express");
const {SpotifyWebApi}=require('spotify-web-api-node');
const route=Router();
const {traerArtista,traerAlbums,traerTracks} = require("../controllers/index")


route.get('/',(req,res)=>{
res.render('home')


})
route.post('/artist-search', traerArtista)
route.get('/albums/:artistId',traerAlbums)
route.get('/tracks/:albumId',traerTracks)



module.exports=route;