require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('home')
})

app.get('/artist-search', async (req, res, next) => {
    const data = req.query.artist
    const apiResponse = await spotifyApi.searchArtists(data) 
    //console.log(apiResponse.body.artists.items)
    res.render('artistsearchresults', apiResponse.body.artists.items)
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







app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
