const express = require('express');
const app = express();
const path = require('path')
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const port = 3000;



hbs.registerPartials(`${__dirname}/views/partials`);
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`)

// Remember to paste here your credentials
const clientId = '00b8947df0fd4e8d8b073f1c001bd7f5',
    clientSecret = '48104987673442298c3330c1e23dac90';

let spotifyApi = new SpotifyWebApi({
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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req , res) => {
  let {artist} = req.query;

  spotifyApi.searchArtists(artist)
  .then(data => {
    let artistsList = data.body.artists.items
    
    res.render('artists', {artistsList});
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
  })

})

app.listen(port)
