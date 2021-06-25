require('dotenv').config();

const { response } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

//Connect to the API
spotifyWebApi
  .clientCredentialsGrant()
  .then((data) => spotifyWebApi.setAccessToken(data.body['access_token']))
  .catch(error => 
    console.log('Something went wrong when retrieving an access token', error)
);

app.get("/", (req, res) => {                                       
    res.render("index");
})   

//param method
app.get("/artist-search", async (req, res) => {
    const {artist} = req.query; 
    console.log(req.query);
    res.render("artist-search");
})

//do we do params here???
router.get('/:artist', (req, res) => {
    console.log(req.params.artist);
  });

// spotifyApi
//   .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
//   .then(data => {
//     console.log('The received data from the API: ', data.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch(err => console.log('The error while searching artists occurred: ', err));


// Our routes go here:
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
