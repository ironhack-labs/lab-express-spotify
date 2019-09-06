const router = require('express').Router()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Acess granted! ')
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/artists', (req, res) => {
  const { artist } = req.query
  // console.log(req.query)
  spotifyApi.searchArtists(artist)
    // spotifyApi.getArtistAlbums(artist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const { items } = data.body.artists
      res.render('artists', { items })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

})

router.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params
  console.log("ID:" + artistId)
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      const { items } = data.body
      res.render('albums', { items })
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/albums/tracks/:id', (req, res) => {
  const { id } = req.params
  spotifyApi.getAlbumTracks(id)
    .then(data => {
      const { items } = data.body
      console.log(items)
      res.render('tracks', { items })
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router