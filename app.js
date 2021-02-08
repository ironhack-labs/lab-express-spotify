require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:

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

app.get('/', (req, res, next) => {
    res.render('home')
})

app.get('/artist-search', async(req, res, next) => {
    const data = req.query.artist
    const datosApiRespuesta = await spotifyApi.searchArtists(data)
    const displayInfo = await datosApiRespuesta.body.artists.items.map((element) => ({
        name: element.name,
        images: element.images[0],
        id: element.id
    }))
    console.log(displayInfo)
    console.log('---------------------------', datosApiRespuesta.body.artists.items)
    res.render('artist-search-results', {displayInfo})
})

app.get('/albums/:artistID', async(req, res) => {
    const data = req.params.artistID
    const albums = await spotifyApi.getArtistAlbums(data)
    const displayInfo = albums.body.items.map((element) => ({
        name: element.name,
        images: element.images[0],
        id: element.id
    }))
    console.log('---------------------------', albums.body.items)
    res.render('albums', {displayInfo})
})

app.get('/tracks/:tracksID', async(req, res) => {
    const data = req.params.tracksID
    const songs = await spotifyApi.getAlbumTracks(data)
    const displayInfo = songs.body.items.map((element) => ({
        name: element.name,
        preview: element.preview_url,
        externalLink: element.external_urls.spotify
    }))
    console.log('---------------------------', songs.body.items)
    res.render('tracks', {displayInfo})
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
