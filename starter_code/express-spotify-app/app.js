var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path");

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));



// Remember to paste here your credentials
var clientId = '5c60409c84594472b855c2366ae161fd',
    clientSecret = '1f054ea0e36b426e86adab312bb6fe66';

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

app.get('/artists/', (req, res, next) => {
  console.log('DEBUG req',req.query.artist);
  let artistName = req.query.artist; 
  
  spotifyApi.searchArtists(artistName)
      .then(data => {
        // console.log(data);
        console.log(data.body.artists.items[0].images[0].url);
        let artistFirstImage = data.body.artists.items[0].images[0].url;
    
        // name, an image, and a button to show the albums for a particular artist on a new view.

        // speicher ine inem array: 

        res.render(`artists`,{artistFirstImage});
      })
      .catch(err => {
        console.log('Something went wrong when retrieving an access token', err)
      })

  
});


app.listen(3000);