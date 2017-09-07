const express = require('express');
const app = express();
const PORT = 3000
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'a3a07db5fdbf488ba0cd7f4a1b2a31fb',
    clientSecret = 'e24fe48294784ae1b2ffa230fabcec2b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token'])
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')

app.use(expressLayout)
app.set('layout', 'index')

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('public'))


app.get('/artists', (req, res) => {
  client.searchArtist()
    .then(res => {
			res.render('search-artist', {
		    searchArtistText: res.value
		  })
    })
    .catch(err => {
      throw err
    })
})
