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


///////////////////////////////////
//ROUTES:

//home
router.get('/', (req, res) => {
    res.render('index')
})

//artists
router.get('/artists', (req, res) => {
  const {artist} = req.body

    spotifyApi.searchArtists(artist)

    .then(data => {
      const artists = data.body.artists.items
       //res.send(data)
        res.render('artists', {artists})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  });

  //albums
router.get('(albums/:id', (req, res) => {
    const {id} = req.params

    spotifyApi.searchArtistAlbums(id)

    .then(data => {
      const albums = data.body.items
       //res.send(data)
      res.render('albums', {albums})
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
})

//tracks
router.get('/tracks:id', (req, res) => {
  const {id} = req.params

  spotifyApi.getAlbumTracks(id)

  .then(data => {
    const tracks = data.body.itemes
    //res.send(data)
    res.render('tracks', {tracks})
  })
  .catch(err => {
    console.log("The error while searching tracks occurred: ", err);
  })
})

module.exports = router