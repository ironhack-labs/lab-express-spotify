const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(`${ __dirname }/views/partials`);


// require spotify-web-api-node package here:

const clientId = '754cd14f5b36450d87a5da075e586af8',
  clientSecret = '87322a9fba7e4d819d560c4e83f4f11f';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.get('/', (req, res) => {
  res.render('home');
});

// setting the spotify-api goes here:
app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      const dt = data.body.artists.items;
      res.render('artists', 
        {dt}
      );
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistsId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistsId).then(
    function(data) {
      console.log('Artist albums', data.body);
      res.render('albums', {data})
    },
    function(err) {
      console.error(err);
    }
  );
})





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));