require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


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

app.get("/", (req, res) => {
    res.render('index');
});

app.post("/artists", (req, res) => {
  let name = req.body.artist;
  spotifyApi
  .searchArtists(name)
  .then(data => {
    let returnedArtists = data.body.artists.items
    console.log(returnedArtists);
    // res.json(data.body.artists.items)
    res.render('artists', {returnedArtists})
    // console.log("The received data from the API: ", data.body.artists.items[0].id);
    // let artistId = JSON.stringify(data.body.artists.items[0].id)
    // return artistId
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  // .then(data => {
  //   res.render()
  // })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
});  
  

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
