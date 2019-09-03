const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:

const clientId = 'c6f3ae5a686a4efab99c82ae935d2233',
  clientSecret = '485a2b71a2bb457abd914dc3752e05e9';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
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
  // res.send('yfjhdjd');
  // return;
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', { searchResult: data.body.artists.items })
    })
    .catch(error => {
      console.log('Error while searching artists: ', error)
    })
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', { albumSearchResults: data.body.items })
    }).catch(error => {
      console.log('Error while searching albums:', error)
    })
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
    .then(data => {
      res.render('tracks', { trackSearchResults: data.body.items })
      console.log(trackSearchResults)

    }).catch(error => {
      console.log('Error while searching albums:', error)
    })
})



// app.get('/tracks/:albumId', (req, res, next) => {
//   spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
//     .then(data => {
//       //res.render('tracks', { data })
//       res.send(data)
//     })
// });

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
