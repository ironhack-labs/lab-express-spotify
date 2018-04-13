const express = require('express');
const app = express();
const hbs = require('hbs');

var SpotifyWebApi = require('spotify-web-api-node');

app.use(express.static(__dirname + "/public"));

app.set ("views", __dirname + "/views");
app.set("view engine", "hbs")
app.set ("layout", __dirname + "/views/layout.hbs");

// Routes 
// ------------
app.get ("/", (req, res, next)=>{
  res.render("home-random");
});

app.get ("/artists", (req, res, next)=>{
  //actions 
  spotifyApi.searchArtists(req.query.searchterm)
  .then(data => {
    console.log(data)
    res.render("artists");
  })
  .catch(err => {
     console.log('Something went wrong...', err);
     res.render("error-pages");
  })

});
// ---search 


// Remember to paste here your credentials
var clientId = 'e11ffab2bfae467d80f5c1c948146dcf',
    clientSecret = '994468f3ca254089a0b75f05bcfb296a';

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


// app.get("/random", (req, res, next) => {
//   const promise = poke.random()
//   promise.then(pokemonObject => {
//      res.render("random", { 
//         imageUrl : pokemonObject.sprites.back_default,
//         name : pokemonObject.name,
//         types : pokemonObject.types,
//       } )
//   })
// });


app.listen (3000, () => {
  console.log("app is running!")
});