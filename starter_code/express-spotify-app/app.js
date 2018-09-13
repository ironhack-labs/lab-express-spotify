const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')
// Remember to paste here your credentials
const clientId = 'c85a117aa703479098b3ee376256062b',
  clientSecret = 'fa50863f0eb640609fbec540fc31c6b8';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((err) => {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials')

app.get('/', (req, res) => {
  res.render('home')
})
app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      let query = req.query.artist
      let artist = data.body.artists.items
      let length = data.body.artists.items.length
      console.log(data.body.artists.items.length)
      res.render('artists', { query, artist, length })
    })
    .catch(err => {
      console.log(err)
    })

})

app.listen(3000)