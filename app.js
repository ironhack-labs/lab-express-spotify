require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

console.log(spotifyApi);

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home", (request, response, next) =>
  response.render("index")
);

app.get('/search-artist', (req, res) => {
      let {search} = req.query;
      
spotifyApi
  .searchArtists(search)
  .then((data) => {
    console.log("The received data from the API: ", data.body);
    let albums = data.body.artists.items;
    console.log(albums);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

    res.render("artist-search-results", {albums});

    })

   
 
  
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );

  

});

app.get("/albums/:artistId", (req, res, next) => {
    let id = albums.id
    console.log(id);
  spotifyApi.getArtistAlbums(id)
  
  res.render("albums", {albums : id});


});





app.listen(4400, () => console.log('My Spotify project running on port 4400 🎧 🥁 🎸 🔊'));
