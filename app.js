require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// const bodyParser = require('body-parser');
// const appRoutes = require('./routes/appRoutes.js');

const app = express();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({extended: true}));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => res.render('home'));

app.get('/artist-search', (req, res) => {
    const {search} = req.query;
    spotifyApi
        .searchArtists(search)
        .then(data => {
            // console.log('The received data from API: ', data.body.artists.items);
            const result = data.body.artists.items;
            // console.log({ result });
            res.render('artist-search', { result });
    })
        .catch(err => console.log('The error while searching artists occured: ', err));
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            // console.log('artist albums', data.body.items[0].images)
            const albums = data.body.items;
            // console.log({ albums })
            res.render('albums', { albums });
        })
        .catch(err => console.log('Error ', err));
})

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            const tracks = data.body.items;
            // console.log({ tracks })
            res.render('tracks', { tracks });
        })
        .catch(err => console.log('Error ', err));
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
