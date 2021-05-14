require('dotenv').config();

const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false })) 
app.use(express.json())

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get("/", (req, res) => res.render("index"))

app.get("/artist-search", (req, res) =>{
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => data.body.artists)
        .then(artists => artists.items)
        .then(items => res.render('results', {items}))
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi
    .getArtistAlbums(req.params.artistId.slice(1))
    .then(data => data.body.items)
    .then(body => res.render('albums', {body}))
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/tracks/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi
    .getAlbumTracks(req.params.artistId.slice(1))
    .then(data => data.body.items)
    .then(body => res.render('tracks', {body}))
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));