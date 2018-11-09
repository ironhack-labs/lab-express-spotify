
const express = require('express');
const app = express();
const hbs = require('hbs')

var SpotifyWebApi = require('spotify-web-api-node');

app.listen(3000, () => {console.log('Server is going to go')});

app.set("view engine", "hbs");


hbs.registerPartials(__dirname + '/views');

app.get("/",(request,response,next)=>{
    response.render("home-page.hbs")
})





  

app.get("/artists",(request,response,next) =>{
const search_query =request.query.search_query;
spotifyApi.searchArtists(search_query)
  .then(data => {
   response.render("artists.hbs",{ artists:data.body.artists.items});
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
  })



    //response.render("artist-page.hbs")
});

//const artistId =data.body.artists.items

app.get('/albums/:artistId',(req,res,next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
      .then(data => {
          let album=data.body.items;
          //console.log(data.body.items)
          console.log("ALBUM SEARCH DONE")
          res.render('album',{album})
      })
      .catch(err => {
          console.log("No artist with this name", err)
      })
})




// Remember to paste your credentials here
var clientId =  '3b08e057ba8c4d678d17f04309063a19',
    clientSecret = 'ca58b4f47f9748ca9b5c948f63f97a9a';

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

