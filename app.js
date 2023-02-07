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

//Ruta homePage
app.get("/", (req,res)=>{
    res.render("home")
})

//Ruta artistas
app.get("/artist-search", (req, res) => {
    const query = req.query.q
    spotifyApi.searchArtists(query)
    .then(data => {
    const dataArtists = data.body.artists.items
    res.render("artist-search-result", {dataArtists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  })

  //Ruta albums
  app.get("albums/:artistsId", (req,res,next)=>{
    const artistsId = req.params.artistsId
    spotifyApi.getArtistAlbums(artistsId)
    .then(data =>{
        const getArtistAlbums = data.body.items
        res.render("albums", {getArtistAlbums})
    })
  })

  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
