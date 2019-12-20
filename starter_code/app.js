require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
// const path = require('path')



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
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  }); 

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  const  {artists} = req.query;
  spotifyApi
  .searchArtists(artists)
  .then(data => {
    // console.log("The received data from the API: ", data.body)
    const { items } = data.body.artists;
    // res.send(data.body)

    res.render('artists', { items });
  })
  .catch(err => {
    throw new Error(err)
  });
});

app.get("/albums/:artistId", (req, res) => {
  const {artistId} = req.params; 
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
    const  items  = data.body.items;
    // res.send(data.body)
    res.render('albums', { items })
  })
  .catch(err => {
    throw new Error(err)
  })
});

app.get("/track/:trackId", (req, res) => {
  const {trackId} = req.params; 
  spotifyApi
  .getAlbumTracks(trackId)
  .then(data => {
    const  items  = data.body.items;
    // res.send(data.body)
    res.render('track', { items })
  })
  .catch(err => {
    throw new Error(err)
  })
});

app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`));
