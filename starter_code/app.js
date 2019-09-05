const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '2ce1eb8bcc2440b6a551088e566be9d6',
    clientSecret = '480c1b0d42f4444dbdcae819a404dd7c';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.get('/', (req, res, next) => {

  res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artists)
  .then(artistsFromAPI => {
    const data = {
      artists :  artistsFromAPI.body.artists.items,
      firstartistname:  artistsFromAPI.body.artists.items[0],


    }
    res.render('artists',  data);
    console.log("The received data from the API: ", artistsFromAPI.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
