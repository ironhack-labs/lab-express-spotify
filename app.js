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

app.get('/albums/:artistId', async (req, res, next) => {
    let albumId = req.params.artistId
    const getAlbums = await spotifyApi.getArtistAlbums(albumId) 
    //console.log(getAlbums.body.items[0])
    res.render('albums', getAlbums.body.items)
})
app.get('/tracks/:albumId', async (req, res, next) => {
    let trackId = req.params.albumId
    const getTracks = await spotifyApi.getAlbumTracks(trackId)
    //console.log(getTracks.body.items[0])
    res.render('tracks', getTracks.body.items)
})


app.listen(3001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
