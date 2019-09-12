require('dotenv').config()

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
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });












  // the routes go here:

app.get("/", (req, res, next) => {
  console.log('opened index')
  res.render("index.hbs");
});

app.get("/albums", (req, res, next) => {
  console.log('opened album')
  res.render("albums.hbs");
});

app.get("/tracks/:trackId", (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.trackId).then(tracks => {
    res.render("tracks.hbs", {tracksToHbs: tracks.body.items})

  }).catch(err => 
    console.log(err))

});

app.get("/artists", (req, res, next) => {

  spotifyApi
  .searchArtists(req.query.artists)
  .then(data => {
    //console.log("Hey")
    //console.log(data.body.artists.items.images)
    ///console.log("The received data from the API: ", data.body);
    //console.log(data.body.artists.items)
    res.render("artists.hbs", {artistsToHbs: data.body.artists.items});

    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
});

// All Albums by an Artist
app.get("/albums/:artistId", (req,res,next)=>{
  let artistId = req.params.artistId;
  console.log(req.params.artistId)
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log(data)
    res.render("albums.hbs", {data})

  }).catch(err => console.log(err))
})

// All tracks of an album
// app.get("/tracks/:albumId", (req,res,next)=>{
//   let albumId = req.params;
//   // console.log(req.params)
//   console.log(albumId)
//   spotifyApi
//   .getAlbumTracks(req.params.albumId)
//   .then(data => {
//     console.log(data)
//     res.render("tracks.hbs", {data})

//   }).catch(err => console.log(err))
// })





// http://localhost:3000/albums/7dGJo4pcD2V6oG8kP0tJRRW
//albumId = 7dGJo4pcD2V6oG8kP0tJRRW
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
