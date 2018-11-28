const express = require('express')
const app     = express()
const hbs     = require('hbs') 
const path    = require ('path')

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'b16a50d349ea4181a0c6c635b6dd41ec',
    clientSecret = '911a0c474fbf426fa258e3cfa4bf0ddd';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.get('/', function (req, res) {
    res.render('index')
  })

app.set('views', path.join(__dirname,'views'));
app.set('view engine','hbs');

app.get('/artists', function (req, res) {
    spotifyApi.searchArtists(req.query.artists)
    .then(data => {
        var searchlist = {artists : data.body.artists.items}
        res.render('artists', searchList)
        console.log('ok')
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log('pas bon')
    })
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))