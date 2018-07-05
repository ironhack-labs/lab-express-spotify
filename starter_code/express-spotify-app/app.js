const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path")

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'a0dbfed1885d4be19554066a1417c881',
    clientSecret = '49df9c6699874d1b912eac57d16eb9dc';

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

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials')

app.get("/",(req,res,next)=>{
  res.render("index")
})
app.get("/getArtist",(req,res,next)=>{
  const queryArtist = req.query.artist;
  spotifyApi.searchArtists(queryArtist)
  .then(data => {
    console.log(data.body.artists.items)
    res.render("artist", {data:data.body.artists.items})
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
  })

})

app.listen(3000, () => {console.log("listening")} );