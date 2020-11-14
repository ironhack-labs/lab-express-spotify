require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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
  .then(data => {
      console.log(data.body['access_token'])
      spotifyApi.setAccessToken(data.body['access_token'])
    })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Get Elvis' albums
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//     function(data) {
//       console.log('Artist albums', data.body);
//     },
//     function(err) {
//       console.error(err);
//     }
//   );
  


//Our routes go here:
app.get("/", (req,res) => {
    res.render('index');
})
app.get("/:artistName", (req,res)=>{
    // get artist from query
    const artist = req.query;
    console.log(artist)

    // find artist on spotify
    spotifyApi.searchArtists(artist).then( (artistFound) => {
        console.log(artistFound);
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
