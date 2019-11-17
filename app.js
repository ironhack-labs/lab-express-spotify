require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

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

app.get('/',(req,res,next) => {
    res.render('index')
})

app.get('/artists',(req,res,next) => {
  spotifyApi
  .searchArtists(req.query.artists)
  .then(data => {
    //console.log("The received data from the API: ", data.body);
    //console.log(data.body.artists);
    
    const newData = {
      artist: data.body.artists.items
    } 
    res.render('artists', newData)
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
})
app.get("/albums", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.query.id)
  .then(data => {
    //console.log("here is the data",data.body.items[0]);
    const theData = {
      album: data.body.items
    }
    //console.log(theData);
    
    res.render('albums',theData);
  })
  .catch( err => {
    console.log("searching artists didnt work",err);
  })
});

app.get('/songs',(req,res,next) => {
  spotifyApi
  .getAlbumTracks(req.query.id)
  .then(data => {
    const bruhData = {
      song: data.body.items
    }
    //console.log(bruhData);
    res.render('songs',bruhData)
  })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
