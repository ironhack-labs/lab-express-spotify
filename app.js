
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi=require('spotify-web-api-node')

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi  
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:



// Our routes go here:

app.get("/", (req, resp)=> resp.render("index"))
app.get("/")




app.get("/artist-search", async (req, res)=>{
    const {Artist}= req.query;
    spotifyApi.searchArtists(Artist)
    .then(data =>{
        const artists=data.body.artists.items;
        console.log('The received data from the API: ', data.body);
        res.render('artist-search-results',{artists})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get("/albums/:id", async (req, res)=>{
    const{id} =req.params
    spotifyApi.getArtistAlbums('id').then(
        function(data) {
            const albums=data.body.items
          console.log('Artist albums', data.body);
          res.render('albums', {albums})
        },
        function(err) {
          console.error(err);
        }
      );
    
})


app.get("/tracks/:id", async (req, res)=>{
    const {id}= require.params
    spotifyApi.getAlbumTracks('id', { limit : 5, offset : 1 })
  .then(function(data) {
      const tracks=data.body.items
    console.log(data.body);
    res.render('tracks', {tracks})
  }, function(err) {
    console.log('Something went wrong!', err);
  });

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
