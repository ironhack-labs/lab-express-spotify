const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:
const clientId = 'bb1fb1ad94f44fb2ac3d6cc1a8f45dae';
const clientSecret = '3ad73b3f16cf41b28271c6bff28730e5';

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
app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artists', (request, response) => {
  spotifyApi.searchArtists(request.query.artistSearch)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items);
      const artistsArray = data.body.artists.items;
      response.render('artists',
        { artistsArray }
      );
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
