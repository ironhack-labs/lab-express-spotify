const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const clientId = '48e86436b8c941afb04770f81a712325',
    clientSecret = 'd9072f77ae8a483a9d942e5e31e527e1';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

hbs.registerPartials(__dirname+ "/views/partials");

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:

app.get('/form', (req, res) => {
  res.render('form');
});

app.get('/artist', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      const items = data.body.artists.items;
      res.render('artist', { items });
      // res.send( data );
    })
    .catch(err => {
      console.log("The error while searching artists: ", err);
    })
  });
  
app.listen(4000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
