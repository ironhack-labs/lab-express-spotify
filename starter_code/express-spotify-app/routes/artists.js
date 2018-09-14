const express=require('express')
const router=express.Router() // No olvides los paréntesis
const SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    accessToken:'BQD3Y8OTNCfFhWtvFfpBWwBbzJLKb-dv3XLOqALixA507oGEY0qV-ogOOGqhQhm13JN_Zom-bax6Hbs0y88'
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken('BQD3Y8OTNCfFhWtvFfpBWwBbzJLKb-dv3XLOqALixA507oGEY0qV-ogOOGqhQhm13JN_Zom-bax6Hbs0y88');
  }, function(err) {
    console.log('Something went wrong!', err);
  });


//const Meme = require('../models/Meme')

// router.get('/',(req,res)=>{
//     res.render('home')
// })

//Para poder poner un post, debemos poner un get
router.get('/artists',(req,res)=>{
    res.render('form') //va a dibujar el formulario vacío
})

router.post('/artists',(req,res,next)=>{ //recibe el formulario lleno
    const {artista} = req.params   
    console.log(req.query)
    //console.log(req.artista)

    spotifyApi.searchArtists(artista)
  .then(function(req) {
    console.log('Search artists by "Love"', req.body);
  }, function(err) {
    console.error(err);
  });

})

router.get('/artists',(req,res,next)=>{ //next es para mandar al siguiente middleware
    
})





/*
router.get('/memes/:id',(req,res,next)=>{
    //1. Obtengo el id de lo que debo mostrar
    const{id} = req.params
    const{dark} = req.query
    //2. Búscalo en la BD
    Meme.findById(id)
    .then(meme=>{
        if(dark) meme.dark = true
        //3. Se lo doy al template
        res.render('detail',meme)
    })
    .catch()
})

*/
module.exports = router