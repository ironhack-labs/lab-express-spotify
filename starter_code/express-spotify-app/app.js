/* require modules */
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser");
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));


app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Remember to paste here your credentials
var clientId = 'f89c033c9e1c4fbfa41a935c6cb8e06d',
    clientSecret = 'addee60437ee4cf0b10f1f8a26073050';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});



app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  let artist = req.query.artist;

  spotifyApi.searchArtists(req.query.artist)
    .then(function(data) {
      // console.log(data.body.artists.items)
      res.render('artists', {
        artists: data.body.artists
      });
    }, function(err) {
      console.log('Error!', err);
    });
});


app.get('/albums/:artistID',(req,res) =>{
     let artistID = req.params.artistID ;
  // console.log(artistID)
  spotifyApi.getArtistAlbums(artistID)
  .then(function(data) {
    // console.log(data.body.items);
    res.render('albums',{
      albumsOfArtits: data.body.items
    })
  }, function(err) {
    console.error('Error!',err);
  });
})

app.get('/tracks/:albumID',(req,res) =>{
  let tracksOfAlbum = req.params.albumID ;
// console.log(artistID)
spotifyApi.getAlbumTracks(tracksOfAlbum)
.then(function(data) {
 console.log(data.body.items);
 res.render('tracks',{
   tracks: data.body.items
 })
}, function(err) {
 console.error('Error!',err);
});
})

app.listen(3000, () => console.log("Ready!"));