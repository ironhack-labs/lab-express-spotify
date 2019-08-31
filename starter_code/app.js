const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')


const app = express();
hbs.registerPartials(__dirname + '/views/partials')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '325c902b99ec477488f6fa44ce45a2a7'
clientSecret = 'df323d87009b4e1e84efcd6686e6249e'

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})

// retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index')
})

app.get('/artists', (req, res, next) => {
  let artist = req.query.artist

  spotifyApi.searchArtists(artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      let artistsData = data.body.artists.items
      res.render('artists', { artistsData })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:artistId', (req, res, next) => {
  let artistId = req.params.artistId

  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      console.log('Artist albums', data.body);
      let albumData = data.body.items
      res.render('albums', { albumData })
    },
    function (err) {
      console.error(err);
    }
  )
})

app.get('/tracks/:albumId', (req, res, next) => {
  let albumId = req.params.albumId

  spotifyApi.getAlbumTracks(albumId)
    .then(function (data) {
      console.log(data.body);
      let tracksData = data.body.items
      res.render('tracks', { tracksData })
    }, function (err) {
      console.log('Something went wrong!', err);
    });

})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
