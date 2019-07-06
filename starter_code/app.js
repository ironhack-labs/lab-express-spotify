const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const bodyParser = require('body-parser');

const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

const clientId = "bc601c18f9be413f93bc2e24eab366ec",
    clientSecret = "c0ae5ac7f5b1458fa6b4e7ec6471e7f4";

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index')
});

app.post('/artists', (req, res, next) => {
 
  spotifyApi.searchArtists(req.body.artistSearch)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', {artist: data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  
});

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  let theID = req.params.artistId;
  spotifyApi.getArtistAlbums(theID).then(
    function(data) {
      res.render('albums', {album: data.body.items});
      console.log('Artist albums -->', data.body.items);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumId', (req, res, next) => {

  let theID = req.params.albumId;
  spotifyApi.getAlbumTracks(theID, { limit : 20, offset : 1 })
  .then(function(data) {
    console.log("Tracks", data.body);
    res.render('tracks', {trackList: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
