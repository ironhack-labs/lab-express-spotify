const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
app.set("layout",__dirname + "/views/layout.hbs")
//ROUTE

app.get("/", (req, res, next)=>{
    res.render("home")
})


app.get("/artist", (req, res, next)=>{
  // res.send(req.query)
  spotifyApi.searchArtists(req.query.q)
    .then(data => {
      // console.log(data.body.artists)
      res.locals.artists = data.body.artists.items
      console.log(res.locals.artists)
      res.render("artist")}
    )
    .catch(err => {
      res.render("error")
    })
})



  app.get('/albums/:artistId', (req, res) => {
    res.render("album")
  });
 



  //test 2 
  // spotifyApi.searchArtists()
  // .then(data => {
  //   if(req.query.q===spotifyApi.name){
  //   res.render("artist", {name: spotifyApi.name} )}
  // })})
    
    // else{
    //   res.render("error")
    // }
  


// TEST 
// app.get("/random", (req, res, next)=>{
//   const promise = poke.random() 

//   promise.then( pokemonObject =>{
//       res.render("random", {name: pokemonObject.name, imgUrl: pokemonObject.sprites.back_default,
//       types: pokemonObject.types })
//   })

// })

// Remember to paste here your credentials
var clientId = 'f3dceeb1e21f449b994e4e0da5ca8ff5',
    clientSecret = '505167ea27f846c58a5d6ec6cdb3c32e';

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

app.listen(3000, ()=> {
  console.log("App is running")
});