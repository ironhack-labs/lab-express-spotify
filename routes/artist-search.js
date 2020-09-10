const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node')
//var spotifyApi = new SpotifyWebApi();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

router.get('/', (req, res)=> {

    const artistValue = req.query.band
    console.log(artistValue)

    spotifyApi
    .searchArtists(artistValue)
    .then(data => {
        // let dataRender = {data.body.artists.items}
        res.render('artist-search-results', {data : data.body.artists.items})
        // console.log('The received data from the API: ', data.body.artists.items)


    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })

  .catch(err => console.log('The error while searching artists occurred: ', err));
       
  });


 







module.exports = router