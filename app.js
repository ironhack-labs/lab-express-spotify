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

app.get('/', (req, res) => {
	res.render('index');
})

app.get('/artist-search', function (req, res) {
    spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
        let artists = data.body.artists.items;
        res.render('artist-search-results', {'artists': artists});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const id = req.params.artistId;
    spotifyApi
    .getArtistAlbums(id)
    .then(data => {
        const albums = data.body.items;
        res.render('albums', {'albums': albums});
    })
    .catch(err => console.log('The error while searching albums occured: ', err));
  });

  app.get('/tracks/:albumId', (req, res, next) => {
    const id = req.params.albumId;
    spotifyApi
    .getAlbumTracks(id)
    .then(data => {
        const tracks = data.body.items;
        console.log('tracks: ', tracks);
        res.render('tracks', {'tracks': tracks});
    })
    .catch(err => console.log('The error while viewing tracks occured: ', err));
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
