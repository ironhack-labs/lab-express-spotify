require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
//const bodyParser = require('body-parser');

// require spotify-web-api-node package here:

const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//app.use(bodyParser.urlencoded({ extended: true })); //activar bodypaser

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
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

// the routes go here:
app.get('/', function (req, res) {
  res.render('index'); //query string
});


app.get('/artists', function (req, res) {
  spotifyApi
  .searchArtists(req.query.artists)
  .then(data => {
    //console.log(req)
    //console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const items = data.body.artists.items;
    res.render("artist", {items});
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
  //res.send(req.query); //query string
});


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
