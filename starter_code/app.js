var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

app.set("views", __dirname + "/views/views");
app.set("view engine", "hbs");
app.set("layout", __dirname + "/views/views/layout.hbs");

hbs.registerPartials(__dirname + '/views/views');

// Remember to paste here your credentials
var clientId = '6aed52dd75d74f31bbaef380da713705',
    clientSecret = '6243c40a4cb14305b55693362a7cd673';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// ROUTES**************************
app.get("/",(req, res, next)=>{
    res.render("main.hbs");
})

app.get("/artists",(req, res, next)=>{
    spotifyApi.searchArtists(req.query.artist) 
    .then(data => {
        // res.send(data.body.artists.items[0]);
      const  chosen = data.body.artists.items;
      res.render("theArtist.hbs", {chosen});
    })
    .catch(err => {
      console.log("err", err);
    })
})

// app.get('/albums/:artistId', (req, res, next) => {
   
//     spotifyApi.getArtistAlbums(req.params) 
//     .then(data => {
//         res.send(data);
//     //   const  chosen = data.body.artists.items;
//     //   res.render("theArtist.hbs", {chosen});
//     })
//     .catch(err => {
//       console.log("err", err);
//     })
//     // res.send(data.body.artists.items[0]);
//   });

//****************************** */
app.listen(3000,()=>{
    console.log("App is running");
})