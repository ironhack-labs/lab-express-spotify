require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const bodyParser = require('body-parser');
// ...
app.use(bodyParser.urlencoded({ extended: true }));

const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: "6d3cdf8e4299470e96f8e0f7081c3923",
  // process.env.SPOTIFY_CLIENT_ID,
  clientSecret: "2376b7dd2c9544fab41cee9be54c0853",
  // process.env.SPOTIFY_CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => res.render('home'));

// http://localhost:3000/artist-search?artist=Stones // => { artist: "Stones" }
app.get('/artist-search', (req, res) => {

  console.log(req.query)

  // req.query.panda

  // -----------------------------------------------

  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      //res.send(data.body)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', data.body.artists)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));


})

app.get('/albums/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id).then(data => {
    res.render('albums', data.body)
  })
})

app.get('/tracks/:id', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id).then(data => {
    res.render('tracks', data.body)
  })
})

app.post('/login', (req, res) => {

  console.log("req.body.email", req.body.email)
  console.log("req.body.password", req.body.password)
  res.redirect('/') // 99% of cases POST ends with a redirect

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));