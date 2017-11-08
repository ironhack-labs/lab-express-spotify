var SpotifyWebApi =  require ('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.set(expressLayouts)
app.set('views', __dirname + '/views/layouts');
app.set('layout', __dirname + '/views/layouts/home');
app.set('view engine', 'ejs');

var clientId =  '7f759afad3234db09899823d1acff498',
    clientSecret =  'a8146e6587ea435ab6e4bfcb9d5dbddc';

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

    app.get('/',(req,res)=>{
      res.render('search-form');
    });

    app.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
    .then(function(data) {
      var artistsArray = data.body.artists.items
      res.render('artists-info', {artists: artistsArray})
    }, function(err) {
      console.error(err);
    })
  });

    app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
