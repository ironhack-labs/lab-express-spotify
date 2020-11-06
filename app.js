
require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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
app.get("/", (req, res) => {
   res.render("index");
});

app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;
  spotifyApi
  .searchArtists(artistName)
  .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items);
    const {items} = data.body.artists;
    //console.log(items[0].images);
    res.render("artist-search-results", { artist: items })
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get("/albums/:artistId", (req, res) => {
   const {artistId} = req.params;
   
   spotifyApi
  .getArtistAlbums(artistId)
  .then((data) => {
    //const {album} = data.body;
    const {items} = data.body
    res.render("albums", {albums : items});
      })
       
  .catch((err => console.log('The error while searching albums occurred: ', err))); 
  
}); 

app.get("/tracks/:albumId", (req,res) =>{
const {albumId} = req.params;
spotifyApi
.getAlbumTracks(albumId)
  .then((data) => {
  const {items} = data.body;
  res.render("tracks", { tracks : items})
  })
  .catch((err => console.log('The error while searching tracks occurred: ', err))); 
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))