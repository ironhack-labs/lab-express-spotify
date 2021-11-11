require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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



/* GET home page */
app.get("/", (req, res) => {  
res.render('index');
});

  // Our routes go here:

app.get("/artist-search", (req, res) => {    
    const searchDetails= req.query.search
    spotifyApi
.searchArtists(searchDetails)
.then(buscador => {
    //res.send(buscador)
    console.log(buscador.body.artists.items[0].images);
    res.render('artist-search', {buscador: buscador.body.artists.items})
})
});



app.get("/albums/:albumId", (req, res) => { 
    const searchAlbums= req.params.albumId
spotifyApi
.getArtistAlbums(searchAlbums)
.then(buscador => {
    // res.send(buscador)
    res.render('albums', {buscador: buscador.body.items})
})
.catch(err => console.log('The error while searching artists occurred: ', err))
});





///// Escuchando ////
app.listen(5000, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));

