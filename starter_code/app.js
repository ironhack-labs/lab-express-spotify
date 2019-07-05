const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = 'ce48874a2dc44b30a1644fef9eb8baab',
    clientSecret = '3ada1a064e1441fa8b353cf801021be3';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })




// the routes go here:
app.get('/',(req,res,next)=>{
  res.render('homepage');
})
app.get("/artists",(req,res,next)=>{
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render("artists",data.body.artists)
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get("/albums/:artistId",(req,res,next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render("albums",data.body)
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get("/tracks/:albumId",(req,res,next)=>{
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render("tracks",data.body)
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
