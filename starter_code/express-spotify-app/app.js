const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');
const port = 3000;
const clientId = 'b15e36f5256b4c158d7b6d8c0e39b826';
const clientSecret = 'c802787ea4ac490facdff0c47edaab7c';
let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join( __dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
//hbs.registerPartials( __dirname + '/views/partials')



// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});



// Rutas
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/artists', (req, res) => {
  let artistName = req.body.artistName;
  spotifyApi.searchArtists(artistName)
  .then(data => {
    let arrayArtist = data.body.artists.items[0];
    //console.log("-----------");
    console.log(data.body.artists.items[0]);
    arrayArtist.forEach(element => {
      
    });
  })
  .catch(err => { console.log(err); })
  res.render('artists');
});


app.listen(port);