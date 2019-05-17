const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const bodyParser = require('body-parser')


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }))


// setting the spotify-api goes here:
const clientId = 'e2f96544302f488b9f4dda2e96f3c5d6',
  clientSecret = '94834e32b6b6488ba75a446f18c1129d';

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

// Randerizado del formulario GET
app.get('/', (req, res, next) => res.render('index'))

// Procesamiento de información POST (en req.body)
app.post('/artists', (req, res) => {
  let artist = req.body.artist
  console.log('Mi artista es:', artist)

  spotifyApi.searchArtists(artist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artists", { artists: data.body.artists.items })

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // console.log(data.body.artists.items)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})


app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      // console.log(data.body.items)
      res.render('albums', { albums: data.body.items })
    })
    .catch(err => {
      console.error(err);
    })

});

app.get('/albums/tracks/:albumId', (req, res, next) => {

  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log(data.body.items)
      res.render('tracks', { tracks: data.body.items })
    })
    .catch(err => {
      console.error(err);
    })

});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
