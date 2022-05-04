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

app.get("/", (req, res) => {
	res.render("home");
});

//search artists by name
app.get("/artist-search", (req, res, next) => {
  //console.log(req.query);
  spotifyApi
  .searchArtists(req.query.q) //'q' is the imput 'name'
  .then((data) => {
    const artistsData = data.body.artists.items;
    //console.log("The received data from the API: ", artistsData);
    res.render("artist-search-results", {artistsData})
  })
  .catch((err) =>
  console.log("The error while searching artists occurred: ", err)
)});

//View albums
app.get("/albums/:artistId", async (req, res, next) => {
  console.log(req.params);
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then((data) => {
    const albums = data.body.items;
    console.log('Artist albums: ', {albums});
    res.render("albums", {albums});
  })
  .catch((err) => {
    console.log("The error while searching albums occurred: ", err)
  })
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
