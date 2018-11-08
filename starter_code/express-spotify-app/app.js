const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials')

// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


// Remember to paste your credentials here
var clientId =  'd9a16933d76344ccb64cb4e5bf054d4c',
    clientSecret = 'b5ddc3bd87c8403988ba255fc99ce39a';

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

app.get('/', function (req, res) {
  res.render('index')
})


app.get('/search',(req,res, next)=>{
  spotifyApi.searchArtists(req.query.artist)
      .then(data => {
          let artist = data.body.artists.items
          console.log("ARTIST SEARCH DONE")
          console.log(data.body)
          res.render('artist',{artist})
      })
      .catch(err => {
      console.log("No artist with this name")
      })
});


app.get('/albums/:artistId',(req,res,next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
      .then(data => {
          let album=data.body.items;
          console.log(data.body.items)
          console.log("ALBUM SEARCH DONE")
          res.render('albums',{album})
      })
      .catch(err => {
          console.log("No artist by this name")
      })
})

app.get('/tracks/:trackId',(req,res,next)=>{
  spotifyApi.getAlbumTracks(req.params.trackId)
      .then(data => {
          let track=data.body.items;
          console.log(data.body.items)
          console.log("TRACK SEARCH DONE")
          res.render('tracks',{track})
      })
      .catch(err => {
          console.log("No tracks")
      })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
