const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser'); //needed for req.body

app.use(bodyParser.urlencoded({ extended: true })); //needed for req.body

// require spotify-web-api-node package here:
// Remember to insert your credentials here
const clientId = '16427f0e6e1e45758703dbdae7ad64e7',
  clientSecret = 'c161266845fa45a1b879ed14155ec72b';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });
//const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res, next) => {
  spotifyApi
    .searchArtists(req.body.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render('artists', {
        myArtists: data.body.artists.items
      });
      // res.send(data.body);
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});
app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
