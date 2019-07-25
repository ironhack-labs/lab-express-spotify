require("dotenv").config()
const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node')
const app = express()

const spotifyApi = new SpotifyWebApi({
    clientId : process.env.clientId,
    clientSecret : process.env.clientSecret
  })

app.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
      .then(function(data) {
          res.render('artist', data.body)
          console.log("The received data from the API: ", data.body)
      }, function(err) {
        console.error(err)
      })
    
  console.log(req.query.artist)
})
module.exports = router