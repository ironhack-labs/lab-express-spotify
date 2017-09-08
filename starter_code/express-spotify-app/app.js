//instantiate express application
const express         = require('express');
const app             = express();
const bodyParser      = require('body-parser');
const expressLayouts  = require('express-ejs-layouts');

//const expressLayouts = require('express-ejs-layouts');

//SpotifyWebApi
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId : '44010391e08c4ed88f1db7339ed9601b',
  clientSecret : '34194b9295f8401f9905ea8719bf5862'
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body.access_token);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(expressLayouts);

app.get('/', (request, response, next) => response.render("index"));
app.get('/artist', (req, res, next) => {
    let artist = req.query.artist;
    spotifyApi.searchArtists(artist).then((data) => {
      let artists = data.body.artists.items;
      res.render('artist', {artists});
    }, (err) => {
      console.log(err);
    });
});



//Server Started
app.listen(3000, () => console.log("I'm running on port 3000!"));
