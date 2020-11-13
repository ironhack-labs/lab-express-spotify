const express = require('express')
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

// const routes = require('.');

router.get('/search', (req, res) => {

    console.log (req.query.artist)
    
    spotifyApi
        
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
          res.render('artist-search-results', { data: data.body.artists.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


module.exports = router

