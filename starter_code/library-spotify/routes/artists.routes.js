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
router.get('/', (req, res) => {
    //info del user a traves del input
    ////console.log(req.query.artist)
    //guardas en const lo que ha escrito el user
    ////const myInput = (req.query.artist)

    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      //console.log(data.body.artists.items)
      // const datos = data.body.artists.items
      // console.log("The received data from the API: ", data.body);
      res.render('artists', {data: data.body.artists.items});

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

module.exports = router;
