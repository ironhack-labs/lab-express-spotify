const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const hbs = require('hbs');
const debug = require('debug')('irondemo:app');
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({ extended: true }));



// Remember to paste here your credentials
var clientId = '389547d61b4b40b58143d62f9f751f39',
    clientSecret = '879f9cecbce14be59bb4d3f3173ad129';

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


app.get('/',(req,res) => {
    res.render('home',{
    });
}) 


/*app.post("/artists", (req, res) => {
  const artist = req.body.artist;

  spotifyApi.searchArtists(artist)
  .then(data => {
      console.log(data)
      let artistArr = data.body.artists.items;
      res.render("artist")
    })
    .catch(err => {
      console.error(err);
    });
});*/


app.get('/artists', (req, res) => {
    let artist = req.query.artist;
    ;
    spotifyApi.searchArtists(artist)
    .then(data => {

      console.log(`Search artists by ${artist}`);
      res.render('artists',{
        data: data.body.artists.items
      });
    })
    .catch(err => {
      console.error(err);
    })
});

app.listen(3000, () => {
    console.log('listening')
})