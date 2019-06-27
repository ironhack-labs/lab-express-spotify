const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
require('dotenv').config();

// require spotify-web-api-node package here:



const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.get("/", (req, res) => {
  res.render("index")
})
app.post("/artists", (req, res) => {
  spotifyApi.searchArtists(req.body.artistFound)
    .then(data => {
      let dataToRender = data.body.artists.items;
  
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists", {dataToRender})
      
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get("/albums/:id", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      let dataToRender = data.body.items;
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("albums", {dataToRender})
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
})

app.get("/tracks/:id", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id, {limit: 5, offset: 1})
    .then(data => {
      let dataToRender = data.body.items;
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("tracks", {dataToRender})
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    })
})




// setting the spotify-api goes here:

const clientId = process.env.API_CLIENT,
  clientSecret = process.env.API_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
