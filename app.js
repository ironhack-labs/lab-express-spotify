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

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get("/", (req, res) =>{
    res.render("index");
console.log(req, "you opened the homepage")
})
;

app.get("/artist-search", (req, res) =>{
    const artist = req.query;
    // ************ MAybe dont need this??

    console.log(artist, "is the query");
    console.log(req.query.artist, "this is the value from the artist key")
// ******* TESTS


    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      console.log(data.body.artists.items);
      res.render("artist-search-result", {artists: data.body.artists.items});
      // ********** WHY DO I PASS AN OBJECT 
      // ********** is the artists a declaration? link to each??
      // ********** WHY DO I HAVE TWO DIRECTORIES

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


