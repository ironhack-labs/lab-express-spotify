require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
// hbs.registerPartials(__dirname + 'views/partials')
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
    res.render('home')
})

app.get('/artist-search',(req, res) => {
    const {search} = req.query

    spotifyApi
    .searchArtists(search)
    .then(data => {
      let artist = data.body.artists.items
      console.log('The received data from the API: ', data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', {artist})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:id', (req, res) => {
  const id = req.params.id
  spotifyApi.getArtistAlbums(id).then(
    (data) => {
      console.log('Artist albums', data.body.items[0].images)
      res.render('albums', {
        album: data.body.items
      })
    },
    (err) => {
      console.error(err)
    }
  )
})

app.get('/tracks/:id', (req, res) => {
  const id = req.params.id
  spotifyApi.getAlbumTracks(id).then(
    function (data) {
      console.log(data.body.items)
      res.render('tracks', {
        tracks: data.body.items
      })
    },
    function (err) {
      console.log('Something went wrong!', err)
    }
  )
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
