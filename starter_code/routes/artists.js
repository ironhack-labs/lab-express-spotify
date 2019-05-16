const express = require('express');
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node")

const clientId = 'a81a8381c0934c85b28c9541fa51b216',
  clientSecret = 'a2c50de272d14f6787d39ac5d00c01e4';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});


// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {

    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

router.get('/', (req, res, next) => {
  // console.log(req.query)
  spotifyApi.searchArtists(req.query.name)
    .then(data => {

      // console.log("The received data from the API: ", data.body.artists.items);
      res.render('artists', { artists: data.body.artists.items })
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

router.get('/albums/:id', (req, res, next) => {
  console.log(req.params)
  const id = req.params.id
  spotifyApi.getArtistAlbums(id)
    .then(albums => {
      // console.log(albums)
      // console.log({ albums: albums.body.items })
      res.render('albums', { albums: albums.body.items })

    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
})


router.get('/tracks/:id', (req, res, next) => {

  console.log("Entro")

  spotifyApi.getAlbumTracks(req.params.id)

    .then(tracks => {
/*       console.log("SOY EL BUENOOOOOO", tracks)
      console.log({ tracks: tracks.body.items })
 */      res.render('tracks', { tracks: tracks.body.items })
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    })
})











module.exports = router

