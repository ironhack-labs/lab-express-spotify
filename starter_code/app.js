require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });


// the routes go here:

app.get('/', (req, res) => {
    res.render('home');
});


app.get('/artists', (req, res) => {
    const { artists } = req.query;
  
    spotifyApi.searchArtists(artists)
      .then((data) => {
          console.log("The received data from the API: ", data.body.artists.items);
          let { items }= data.body.artists;
          res.render('artists', {items});
        })
        .catch((err) => {
            console.log("The error while searching artists occurred: ", err);
        });
  
  });


app.listen(3030, () => console.log("My Spotify project running on port 3030 🎧 🥁 🎸 🔊"));