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
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


  
// Our routes go here:
app.get('/', (req, res, next) => {

  res.render('artist')

  })

     app.get("/albums/:id", (req, res, next) => {
       console.log("***", req.params.id)
       spotifyApi
       .getArtistAlbums(req.params.id)
       .then((result) => {
           res.render("albums", result)
       })
       .catch(err => console.log("error accessing the album: ", err))
   })

  app.get("/search", (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.name)
    .then((result)=>{
      console.log("The received data from the API: ", result.body.artists.items);
      res.render("artistsearchresults", {result:result})
    })
    .catch(err => console.log("this is an error:", err))
})





app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
