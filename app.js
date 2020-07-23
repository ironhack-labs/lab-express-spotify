require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
          console.log('The received data from the API: ', data.body.artists.items);
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
          res.render('artist-search-results', { artists : data.body.artists.items})
    })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const myParams = req.params.artistId
    spotifyApi
        .getArtistAlbums(myParams)
        .then(data => {
          console.log('Artist albums', data.body);
          res.render('albums', { albums : data.body.items })
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
    })

app.get('/albums/:artistId/tracks/:albumId', (req, res, next) => {
    const theParams = req.params.albumId
    spotifyApi
        .getAlbumTracks(theParams)
        .then(data => {
          console.log(data.body.items);
          res.render('tracks', { tracks: data.body.items })
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
