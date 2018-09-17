const express = require('express')
const router = express.Router()


router.get('/', (req,res, next) => {
  const spotify = req.app.get('spotify')
  const {artist} = req.query
  spotify.searchArtists(artist)
    .then(data => {
      let items = data.body.artists.items;
      res.render("artists", {items})
      console.log(items[0].images)
    })
    .catch(err => {
      next(err)
    })

})


module.exports = router