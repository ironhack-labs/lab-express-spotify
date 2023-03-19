require('dotenv').config();

const { query } = require('express');
const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
app.get("/", (req, res, next)=>{
    res.render("home")
    
})

app.get("/artist-search", (req,res,next)=>{
    const nameArtist = req.query.artist
spotifyApi
  .searchArtists(nameArtist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    
    res.render("artist-search-results", data.body)
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
        // .getArtistAlbums() code goes here
  
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data)=>{
        console.log(data.body.items[0].images)
        res.render("albums", data.body)
    })
    .catch((error)=>{
      console.log( "album", error)
    })
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
