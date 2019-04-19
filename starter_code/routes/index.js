const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node');

//settings of Spotify
const clientId = '38dd7da0be74431197219d13546a76c3',
  clientSecret = '5fef3fa49b34411a94e3989583bd08e3';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


//home
router.get('/', (req, res) => {
    res.render('index')
})

router.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        console.log("The received data from the API: ", data.body);
        //res.send(data)
        res.render('artists', {data.body.artists.items})
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });




module.exports = router