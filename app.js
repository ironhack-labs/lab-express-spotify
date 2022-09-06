const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();


// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  //Configuration of hbs
    app.set("views", __dirname + "/views");
    app.set("view engine", "hbs");

  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req,res) =>{
    spotifyApi
  .searchArtists("/:artist")
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render("index");
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
   
})

app.get("*", (req,res)=>{
    console.log("🚀 ~ file: app.js ~ line 42 ~ app.get ~ res", res)
    res.send("<h1>404 NOT FOUND</h1>")
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
