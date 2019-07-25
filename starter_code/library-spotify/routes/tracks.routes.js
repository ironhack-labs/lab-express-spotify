const express = require('express');
const router  = express.Router();
require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

//datos de api


const clientId = process.env.CLIENTID,
    clientSecret = process.env.CLIENTSECRET


const spotifyApi = new SpotifyWebApi ({
  clientId : clientId,
  clientSecret : clientSecret
})

spotifyApi.clientCredentialsGrant()
  .then(data =>{
      spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error =>{
      console.log('Something went wrong when retrieving an access token', error)
  })

/* GET home page */
router.get('/:id', (req, res) => {
    //info del user a traves del input
    ////console.log(req.query.artist)
    //guardas en const lo que ha escrito el user
    ////const myInput = (req.query.artist)
  //console.log(req.params.id)
    spotifyApi.getAlbumTracks(req.params.id)
    .then(tracks => {
      console.log(tracks.body.items)
    //   res.render('tracks', {albums: albums.body.items});

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

module.exports = router;
