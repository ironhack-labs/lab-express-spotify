require('dotenv').config();

const { response } = require('express');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

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

//Homepage
app.get("/", (req,res,next)=> {

    res.render("home");
})

//Search for artist 
app.post("/artist-search", (req, res, next) => {
  const nameArtist = req.body.artist;
  spotifyApi
    .searchArtists(nameArtist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0].images
      );
      res.render("artist-search-results", data.body);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


