const express = require('express');
const router = express.Router()

const SpotifyWebApi = require('spotify-web-api-node');


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


router.get('/', (req, res, next)=>{
    res.render('index')
})



 router.get("/artist-search", (req, res, next)=>{
     //console.log({theQuery:req.query})
    spotifyApi
  .searchArtists(req.query.searchQuery)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
   //res.redirect('back');
   const dataToDisplay = {
       searchResults: data.body.artists.items
   };

   res.render ('search-results', dataToDisplay)
})
  .catch(err => console.log('The error while searching artists occurred: ', err));

 });


router.get('/albums/:id', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
    res.render('albums', {albums: data.body.items});
  })
  .catch(error=> {
    console.log('error while searching for albums ${error}')
  });
});



router.get('/tracks/Lid', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {
    res.render('view-tracks', {tracks: data.body.items});
  })
  .catch(error=> {
    console.log('error while searching for albums ${error}')
  });
});


router.get('/tracks/:id', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {
    res.render('tracks', {tracks: data.body.items});
  })
  .catch(error=> {
    console.log('error while searching for albums ${error}')
  });
});




module.exports = router;