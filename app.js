require('dotenv').config();

// require spotify-web-api-node package here:
const express = require('express');
const hbs = require('hbs');
const async = require('hbs/lib/async');
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
app.get("/", function(req, res, next) {
    res.render("home")
    
});



app.get("/artist-search", function (req, res, next) {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
        // console.log( "The received data from the API: ",
        // data.body.artists
        //   );
      res.render("artist-search-results", {artist: data.body.artists.items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
        const albumData ={
            albumsArray: data.body,
            artistName: data.body
        }
        // feel like res.render needs to go here but wen i do the site crashes.
        // can't get this get.app part to console.log so i cannot find the parts i need wy won't it console.log.
    }) 
    console.log(data)
    res.render("albums",{ albums: data.body }); // here i can get the site to appear but he cannot read the data.
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
