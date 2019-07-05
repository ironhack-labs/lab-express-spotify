const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '1a0d85ee1bac4542b5a8925b3d95ed0b',
    clientSecret = '4fcd0eb66aa941a0930cbf9d6c8e12a2';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
.then( data => {
spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
console.log('Something went wrong when retrieving an access token', error);
});

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials'); 

// the routes go here:
app.get('/', (req, res)=>{
  res.render('home');
});

//api calls to get artist
app.get('/artists', (req, res)=>{
  spotifyApi.searchArtists(req.query.artists)
    .then(data => {
      res.render('artists', {artists: data.body.artists.items});//data.body.artists
      console.log("The received data from the API: ", data.body.artists.items);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

//ALL ARTIST ALBUMS
app.get('/albums/:id', (req, res)=>{
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      res.render('albums', {artists: data.body.items});
      console.log("The received data from the API: ", data.body.items);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

//INDIVIDUAL ALBUM
app.get('/tracks/:id', (req, res)=>{
  spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
      res.render('tracks', {track: data.body.items});
      console.log("The received data from the API: ", data.body.items);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
