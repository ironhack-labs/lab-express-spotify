const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to insert your credentials here
const clientId = '6b1ca752ba2c43d48b2ee4c7f5fbed68',
  clientSecret = '4d266d74428e4a3d98bb3b35d69535ef';

const spotifyApi = new SpotifyWebApi({
  clientId, clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// setting the spotify-api goes here:


// the routes go here:
app.get('/', (req, res) => res.render('index'))

app.post('/artists', (req, res) => {
  const { artist } = req.body
  spotifyApi.searchArtists(artist)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const { items } = data.body.artists 
      res.render('artists', {items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:id', (req, res) => {
  const { id } = req.params
  spotifyApi.getArtistAlbums(id)
    .then(data => {
      const { items } = data.body 
      res.render('albums', {items})
    })
    .catch(err => console.log("Feo feo", err))
})

app.get('/tracks/:id', (req, res) => {
  const { id } = req.params
  //console.log(id)
  spotifyApi.getAlbumTracks(id)
    .then(data => {
      const { items } = data.body
      res.render('tracks', {items})
    }) 
    .catch(err => console.log("Mal", err))
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
