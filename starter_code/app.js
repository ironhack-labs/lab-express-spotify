const express       = require('express');
const hbs           = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser    = require('body-parser')
const path          = require('path') 

const app   = express();
const PORT  = 3000
app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }))


// setting the spotify-api goes here:
const clientId = 'c8cfaabda26d41c19a78c8ca6f80101b',
    clientSecret = '18c19c07781c471481fd40b15e109be1';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
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
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/artists', (req, res, next) => {
  const { artist } = req.body
  spotifyApi.searchArtists(artist)
  .then(data => {
    const { items } = data.body.artists
    res.render('artists', {items})
   })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
})
app.get('/albums/:id', (req,res) => {
  const { id } = req.params
  spotifyApi.getArtistAlbums(id)
  .then(data => {
    const { items } = data.body
    res.render('albums', {items})
  })
  .then(err => {
      console.log("The error while searching albums occurred: ", err);
    })
  })
  
  app.get('/tracks/:id', (req,res) => {
    const { id } = req.params
    spotifyApi.getAlbumTracks(id)
    .then(data => {
      const { items } = data.body
      res.render('tracks', {items})
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    })
})
app.listen(PORT, () => console.log(`My Spotify project running on http://localhost:${PORT} 🎧 🥁 🎸 🔊`));
  