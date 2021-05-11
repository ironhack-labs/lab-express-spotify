require('dotenv').config()
const express = require('express')
const hbs = require('hbs')
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const app = express()
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:
app.get('/', (req, res, next) => {
  res.render('index')
})
app.get('/artist-search', (req, res, next) => {
  console.log(req.query)
  const {artist} = req.query.artist
  console.log(artist)
  spotifyApi
                .searchArtists(artist)
    .then( data => {
      console.log('The received data from the API: ', data.body)
      // console.log('result:', data.body.artists.items)
      const result = {artists: data.body.artists.items}
      res.render('artist-search-result', result)
    }).catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  const {artistId} = req.params
  spotifyApi.getArtistAlbums(artistId)
  .then((data) => {
    console.log('Artist albums:', data.body.items[0].artists[0].name);
    const result = {albums: data.body.items}
    res.render('albums', result )
  },(err) => {
    console.error(err);
  });
});

app.get('/tracks/:tracksId', (req, res, next) => {
  const {tracksId} = req.params
  spotifyApi.getAlbumTracks(tracksId)
  .then(function(data) {
    console.log("tracks:", data.body.items);
    const result = {tracks: data.body.items}
    res.render('tracks', result)
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3010, () => console.log('My Spotify project running on port 4000 :headphones: :drum_with_drumsticks: :guitar: :loud_sound:'))