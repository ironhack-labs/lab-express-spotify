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

// Our routes go here:

app.get('/', (req, res, next) =>{

    const search = req.query.search
    res.render("home", {
    })
})

app.get('/search-artist', async(req, res, next)=>{
    const data = req.query.artist
    const datosApi = await spotifyApi.searchArtists(data)
    console.log(datosApi.body.artists.items)
    res.render('artistsearchresults', datosApi.body.artists.items)
})

app.get('/search-albums/:artistId', async(req, res, next)=>{
    const dataid = req.query.album
    const datosApiAlbum = await spotifyApi.getArtistAlbums(dataid)
    console.log(datosApiAlbum.body.album)
    res.render('albumsinformation', datosApiAlbum.body.album)
})


app.listen(3001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
