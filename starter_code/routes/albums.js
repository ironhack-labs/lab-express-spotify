const express = require('express')
const router = express.Router()


const SpotifyWebApi = require('spotify-web-api-node')

// setting the spotify-api goes here:

const clientId = '7fa2c96746a4442383a0a2b49f21aecd',
    clientSecret = '3329b53a46a14134976a7e2e7f63f5c5';

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

router.get('/:id', (req, res, next) => {

    console.log(req.params.id)

    spotifyApi.getArtistAlbums(req.params.id)
    .then(albums=> {
        res.render('albums', {albums: albums.body.items})        
    })

    .catch(err => {
       console.log("The error while searching artists occurred: ", err);
     })

});

// router.get('/', (req, res, next) => {

//     console.log(req.query)


// spotifyApi.searchArtists(req.query.artist)
//     .then(loDeLaApi => {

//       console.log("The received data from the API: ", loDeLaApi.body.artists.items);
//       // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//       res.render('artist', {artist:loDeLaApi.body.artists.items})
      

//     })
//     .catch(err => {
//       console.log("The error while searching artists occurred: ", err);
//     })

// })


module.exports = router