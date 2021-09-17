require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  }); 
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:
app.get("/",(req,res) => {
    res.render("home-page");
})

app.get("/artist-search",(req,res) => {
    const objetoDelQuery=req.query
    const artist=objetoDelQuery.artist
    console.log(artist);

    spotifyApi
  .searchArtists(artist)
  .then(data => {
  //  console.log('The received data from the API: ', data.body.artists);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
   
    res.render("artist-search-results",data.body.artists)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
    const objetoDelParam=req.params
    const artistId=objetoDelParam.artistId
    console.log(req.params)
    spotifyApi
   .getArtistAlbums(artistId)//los params dejan acceder las variables que vienen en la URL
   .then(data => {
       console.log('The received Albums data from the API :',data.body)
       res.render('albums',data.body)
    
   })
   .catch(err => {
       console.log(err);
   })
    // .getArtistAlbums() code goes here
  });

  app.get('/tracks/:albumId',(req, res) =>{
    const objetoDelParam=req.params
    const albumId=objetoDelParam.albumId
   spotifyApi
   .getAlbumTracks(albumId)
   .then(data => {
       //console.log('The received data from the API:',data.body)
       res.render('tracks',data.body)
   })
   .catch(err => {
       console.log(err);
   })
   })
  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
