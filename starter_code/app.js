const express = require('express');
const bodyParser = require ('body-parser');
const hbs = require('hbs');

const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to insert your credentials here
// setting the spotify-api goes here:
const clientId = '64066bf957ec438bb542a3aea3f35916';
const clientSecret = '99342f69fae648819901e7d6e5a9dbd6';
const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( (data) => {
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  })


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  // console.log(req.body.name);
  const artist = req.query.name;
  spotifyApi.searchArtists(artist)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', { artist: data.body.artists.items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/album', (req, res, next) => {
  // console.log(req.body.name);
  const artist = req.query.name;
  spotifyApi.searchArtists(artist)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', { artist: data.body.artists.items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

// server started
app.listen(4000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
