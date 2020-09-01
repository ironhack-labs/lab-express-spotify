require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get('/', (req, res, next) => {
    console.log(req.url);
    res.render('index')
})

app.get('/artist-search', (req, res, next) => {
    console.log(req.query)
    spotifyApi
        .searchArtists(req.query.artist)
        .then((data) => {
            console.log("The received data from the API: ", {artists: data.body.artists.items});
            res.render('artist-search-results', {artists: data.body.artists.items})
        })
        .catch((err) =>
            console.log("The error while searching artists occurred: ", err)
        );
});

app.get('/albums/:artistId', (req, res, next) => {
    console.log(req.params)
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
            console.log("The received data from the API: ", {albums: data.body.items});
            res.render('albums', {albums: data.body.items})
        })
        .catch((error) => {
            console.log(error)
        })
})

app.get('/tracks/:albumId', (req, res, next) =>{
    console.log(req.params)
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then((data) => {
            console.log("The received data from the API: ", {tracks: data.body.items});
            res.render('tracks', {tracks: data.body.items})
        })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
