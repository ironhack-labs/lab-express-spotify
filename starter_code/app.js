const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const path    = require('path');

// require spotify-web-api-node package here:


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(path.join(__dirname, 'public')));


// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = 'c9f8132ecc93451fa2421c2e331f34d8',
    clientSecret = '6a2a55517f0446c399565526953439f8';

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
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        const result ={
            data: data
        }
        res.render('artists',result);

      console.log("The received data from the API: ", data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });
  
  

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
