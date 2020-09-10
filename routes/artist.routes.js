const express = require('express')
const router = express.Router()

router.get('/search', (req, res) => {

    console.log(spotifyApi)

spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body)
    const artist = data.body.artists.items
    res.render('artist-search-result', { artist } )
   
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
    
})

router.get('/albums/:artistId', (req, res, next) => {
   
})


module.exports = router