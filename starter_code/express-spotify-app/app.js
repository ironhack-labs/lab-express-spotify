//SET UP
//-------------------------------------------------------
const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');
app.set("view engine", "hbs");


// Remember to paste here your credentials //done
var clientId = '705e2cc9fd304731b19cc12cb1db18cf',
    clientSecret = 'd21777bd86da4fb0969b607fae132728';

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


//ROUTES
//---------------------------------------------------------
app.get("/", (request, response, next) => {
    response.render("home-page.hbs");
  });

  app.get("/artists", (request, response, next) => {
    console.log(request.query)
   const {artist} = request.query
    spotifyApi.searchArtists(artist)
    .then(data => { 
    console.log(data);
    // console.log(data.body.artists);
     console.log(data.body.artists.items[0].name);
     console.log(data.body.artists.items[0].images[0].url);
      //let artistList = data.body;
      //console.log(artistList);

      //response.json( data );
      //response.locals.spotifySearch = data; 
      //response.render("artists.hbs");
      response.render("artists", {artists: data.body.artists.items});

    })
    .catch(err => {
      console.log("nope", err);
    })

  });


//app.get("/artists", (request, response, next) => {
// spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
// .then(data => {
//    response.locals.spotifySearch = data;// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//    response.render("artists.hbs");
// })
// .catch(err =>{
//    console.log(error)
// });
//});





  app.listen(3000, () => {
    console.log("We are ready to go! 🤼‍♂️");
  });