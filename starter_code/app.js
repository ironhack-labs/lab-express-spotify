const express = require('express');
const hbs = require('hbs');
const app = express();
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = 'f0248061d929487c9ad73be5cd876907',
clientSecret = '32907005a5be49b9b862c1fb4c8a64a1';



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res) => {
  // console.log(req.body.artist)
  spotifyApi.searchArtists(req.body.artist)
  .then(data => {
    console.log("The received data from the API: ", data.body.artists.items);
    res.render('artists', {artists : data.body.artists.items});

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res) => {
  console.log(req.params.artistId)

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
      console.log('Artist albums', data.body.items);
      res.render('albums', {albums: data.body.items} )
    })
  .catch(err => {
      console.error("The error while searching albums occurred: ", err);
    })
});


app.get('/tracks/:albumId', (req, res) => {
  console.log(req.params.albumId)

spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log(data.body.items);
    var tracks = data.body.items
    res.render('tracks', {tracks})
  }, function(err) {
    // console.log('Something went wrong!', err);
  })
});


// the routes go here:
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
