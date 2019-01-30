const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node'); 



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = 'f3417df9c30c4962bc2a47448af5c03d',
clientSecret = 'f7f05ab36bc546679a689daa0f68eee6';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index')
})

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artistsName)
    .then(data => {
      console.log('Data received from the API: ', data.body)
      console.log('DATA ENTRY: ', data.body.artists.items[0])
      res.render('artists', data)
    })
    .catch(err => {
      console.log('An error occured while searching for artist: ', err)
    })
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
