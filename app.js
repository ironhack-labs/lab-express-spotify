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
  app.get("/", (req, res, next) => {
    
    res.render("home");
  })

  app.get("/artist-search", (req, res, next) => {
    let searchArtist = req.query.searchArtist
    
    spotifyApi
    .searchArtists(searchArtist)
    .then(responseFromSpotify => {
      //console.log('The received data from the API: ', responseFromSpotify.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      return responseFromSpotify.body.artists.items;       
      })
    .then(artistsInfo => {      
      res.render("artist-search-results", {artists:artistsInfo});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
    
  })

  app.get('/albums/:artistId', (req, res, next) => {
    let artistId = req.params.artistId;
    //console.log(req.params)
    
    spotifyApi
      .getArtistAlbums(artistId)
  
      .then(albumsDataFromSpotifyApi => {
          //console.log(albumsDataFromSpotifyApi.body.items);
          res.render("albums", {albums:albumsDataFromSpotifyApi.body.items})

    })
      .catch(err => console.log('The error while searching albums of artists occurred: ', err));
  });

  app.get('/tracks/:albumId', (req, res, next) => {
    let albumId = req.params.albumId;
    spotifyApi
    .getAlbumTracks(albumId)
    .then(trackData =>{
        console.log(trackData.body)
        res.render("tracks",{data:trackData.body.items})
    })
    .catch(err => console.log('The error while searching tracks of albums occurred: ', err));
});

app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
