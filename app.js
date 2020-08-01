require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:

    //ROUTE FOR ARTIST SEARCH HOME PAGE
    app.get('/', (req, res) => {
    
        res.render('home', req.params);
      });



    //ROUTE FOR RESULTS PAGE
    app.get('/artist-search', (req,res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const { name, images} = data.body.artists.items[0]
        // console.log('The received data from the API: ', data.body.artists);
        res.render('artist-search-results', {name: name, image:images[0].url});
        })
  
        .catch(err => console.log('The error while searching artists occurred: ', err));
        console.log('---------------------------------');
    })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
