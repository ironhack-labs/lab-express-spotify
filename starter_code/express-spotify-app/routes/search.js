var express = require('express')
var router = express.Router()

const SpotifyWebApi = require('spotify-web-api-node')// Remember to paste your credentials here
const clientId = '5e03db01c86a49a1900d615e5ee481d9'

const clientSecret = '1dd659c24e544b53bd40dc6fcc6f2ef9'
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token'])
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err)
  })

router.get('/', (req, res, next) => {
  console.log('test')
  const artistId = req.query.artist
  spotifyApi.searchArtists(artistId)
    .then(response => {
      const data = {
        name: response.body.artists.items[0].name,
        popularity: response.body.artists.items[0].popularity,
        imageUrl: response.body.artists.items[0].images[0].url
      }
      console.log(data.imageUrl)
      res.render('artist', data)
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
})

module.exports = router
