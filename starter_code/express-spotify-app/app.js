
const express = require('express');
const app = express();
const hbs = require('hbs');
const path     = require('path') 
const bodyParser = require('body-parser');

var SpotifyWebApi = require('spotify-web-api-node');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste your credentials here
let clientId = '6e21a6e2b9f04b27a439d46860309822',
    clientSecret = '96841d6770d741acabbecc649eaa6090';

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

app.post('/artist', (req, res) => {
  let { artistName } = req.body;
  console.log('artistName', artistName)
  spotifyApi.searchArtists(artistName)
    .then(data => {
      let artistList = data.body.artists.items;

      pageData = {
        pageTitle: "Artist",
        artistList: artistList 
      };

      res.render("artist", pageData)
    })
    .catch(err => {
     console.log(err);
    })
 
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))