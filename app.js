require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Register the location for handlebars partials here:
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home')
})

// Our routes go here:
app.get('/artist-search', (req, res) => {
    const name = req.query.name;

    spotifyApi
        .searchArtists(name)
        .then(data => {
            const artists = data.body.artists.items;
            res.render('artist-search-results', {artists, name})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const nameArtist = req.query.artist;
    const idArtist = req.params.artistId; 
    spotifyApi
        .getArtistAlbums(idArtist)
        .then(data => {
            let albums = data.body.items;
            console.log(data.body.items)
            res.render('albums', {albums, nameArtist})
        })
});


app.get('/tracks/:albumId', (req, res, next) => {
    const nameArtist = req.query.artist;
    const albumId = req.params.albumId; 
    spotifyApi
        .getAlbumTracks(albumId, { limit : 5, offset : 1 })
        .then(function(data) {
            let tracks = data.body.items;
            res.render('tracks', {tracks, nameArtist})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
