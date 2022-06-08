require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi= require ('spotify-web-api-node')
// require spotify-web-api-node package here:


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //entra mi .env
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()//promesa que se comunica con spotify
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials")



// setting the spotify-api goes here:

// Our routes go here:
app.get("/",(req,res,next)=>{
  res.render("artist-search")

   
})

app.get("/artist-search",(req,res,next)=>{
console.log(req.query,"si llegamos")
    const {search}=req.query //destrucutracion 


spotifyApi
  .searchArtists(search)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists);
  res.render('artist-search-results',{albums:data.body.artists.items})
  
  
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id',(req,res,next)=>{
  const {id}= req.params

  console.log("LlegamsoalID",id)
  
  spotifyApi.getArtistAlbums(id)
  .then(function(data) {
    console.log('Artist albums', data.body.items);
    res.render("albums",{albums:data.body.items})
  }, function(err) {
    console.error(err);
  });
})

app.get("/tracks/:albumId",(req,res,next)=>{
const {albumId}= req.params;

spotifyApi
.getAlbumTracks(albumId)
  .then((data) =>{
    console.log("los tracks",data.body.items);
    res.render("tracks",{track:data.body.items})
  })
  .catch(error=> console.log('The error while searching artists occurred: ', err));
  });









app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
