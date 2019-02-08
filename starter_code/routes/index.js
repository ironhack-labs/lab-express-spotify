let router = require('express').Router()
let spotifyApi = require('../middlewares/spotifyConfig')

router.get('/', (req,res)  => {
  res.render('index')
})

router.get('/artists', (req, res) => {
  res.render('artists')
})

router.post('/artists', (req, res) => {
  spotifyApi.searchArtists(req.body.searchArtist)
    .then(data => {
      res.render('artists',{data})
      console.log("The received data from the API: ", data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

router.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(item => {
    console.log(item.body.items)
    res.render('albums', item)
  })
  .catch(e => res.send(e))
})

router.get('/tracks/:id', (req, res) => {
  console.log(req.params)
  spotifyApi.getAlbumTracks(req.params.id)
  .then(item => {
    res.render('tracks', item)
  })
  .catch(e => res.send(e))
})


module.exports = router