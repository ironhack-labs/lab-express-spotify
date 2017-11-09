const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.use(expressLayouts);
//app.set('layout', __dirname + '/views/layout/main-layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));

const clientId = '9c828d7cbbe649d3bb47ef0569acd194',
    clientSecret = 'd0e54c800f894af1b4135e1fdab25909';
const spotifyApi = new SpotifyWebApi({
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


app.get('/',(req,res)=>{
  res.render('home');
});

app.get('/artists',(req,res, next)=>{
  let artist = req.query.artists
  spotifyApi.searchArtists(artist)
  .then((data) => {
    res.render("artists", {
      artistsAPI: data.body.artists.items
    });
  }).catch((err) => {
    //handle error
  });
});

app.get("/artists:id", (req, res, next) => {
  let artistsID = req.params.artists
  spotifyApi.getArtistAlbums(artistID)
  .then() => {
    res.render("artists:id", {
      
    })
  }
})

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
