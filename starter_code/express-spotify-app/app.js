var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '456cf174fd9240a7a5c5e34110634ab4',
  clientSecret = '251ecde1b92c48f1867cb8dc3182caa9';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

const express = require('express')
const app = express()

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artists', (req, res) => {
  //res.render('artists',{artists: [{name: 'Drake'}]})
  spotifyApi.searchArtists(req.query.searchArtist).then(data => {
    data.body.artists.items.forEach((a) => {
      a.image = a.images[0]
    })
    res.render('artists', { artists: data.body.artists.items })
  })
})


app.listen(3000)