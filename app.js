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



    

    app.get("/", (req, res, next) => {
        res.render("index");
    });

 

   
  
 
    app.get("/artist-search-results", (req, res, next) => {
       /*  res.render("artist-search-results"); */
       spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:artistsId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistsId)
    .then(data => {
      res.render('albums', { albums: data.body.items })
      console.log('Artist albums', data.body.items);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/tracks/:albumsId', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumsId)
    .then(data => {
      res.render('tracks', { tracks: data.body.items })
      console.log('track', data.body.items);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

});
    



    


// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
