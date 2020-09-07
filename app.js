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
app.get('/', (req, res) => {
    // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    //     function(data) {
    //       console.log('Artist albums', data.body);
    //     },
    //     function(err) {
    //       console.error(err);
    //     }
    //   );
    res.render('home')
});

app.get('/artist-search', (req, res) => {
    // console.log(data.body.artists.item)
    spotifyApi
    .searchArtists(req.query.title)
    .then(data => {
    console.log('Search artists', data.body.artists.items);
    res.render('artistSearch', data.body)
  })
})
  
app.get('/albums/:artistId', (req, res, next) => {
    console.log(req.params.artistId)
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
          console.log('Artist albums', data.body);
          res.render('albums', data.body)
        },
        function(err) {
          console.error(err);
        })}
);

  
app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
          console.log({tracks: data.body.items});
          res.render('tracks', {tracks: data.body.items})
        },
        function(err) {
          console.error(err);
        })}
);


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
