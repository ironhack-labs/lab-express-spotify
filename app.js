require('dotenv').config();

const spotifyWebApi = require('spotify-web-api-node')
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const spotifyApi = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, resp)=>{
    resp.render('index')
})


app.get("/artist-search", (req, resp)=>{
    console.log(req.query.artistName)
    spotifyApi.searchArtists(req.query.artistName)
    .then((data) => {
        resp.render('artist-search-results',{artists: data.body.artists.items});
    })
    .catch((error) => console.log('Hay un error en la búsqueda', error))
});


app.get('/albums/:artistId', (req, res)=>{
    console.log(req.params.artistId);
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
        console.log(data);
        res.render('albums', {albums: data.body.items})
    })
    .catch((error) => console.log('Erorr', error))
})

app.get('/tracks/:albumId', (rep, res) => {
    spotifyApi
    .getAlbumTracks(req.params.albumID)
    .then((data) => {
        console.log(data.body)
        res.render('tracks', {tracks: data.body.items})
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
