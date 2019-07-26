require("dotenv").config()
const express = require('express')
const hbs = require('hbs')

const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
hbs.registerPartials(__dirname + '/views/partials')
const spotifyApi = new SpotifyWebApi({
  clientId : process.env.clientId,
  clientSecret : process.env.clientSecret
})

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error)
  })

// the routes go here:
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);
// const artistsRoutes = require("./routes/artists.routes");
// app.use("/artists", artistsRoutes)

app.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
      .then(function(data) {
        res.render('artists', {data: data.body.artists.items})
      }, function(err) {
        console.error(err)
      })
})

app.get('/albums', (req, res) => {
  spotifyApi.getArtistAlbums(req.query.album)
    .then(function(data) {
      res.render('albums', {album: data.body.items})
    }, function(err) {
      console.error(err)
    })

})

app.get('/tracks', (req, res) => {
  spotifyApi.getAlbumTracks(req.query.track)
    .then(function(data) {
      console.log("Track: ", data.body)
      res.render('tracks', {track: data.body.items})
    }, function(err) {
      console.error(err)
    })

})



  

module.exports = app;


app.listen(process.env.PORT, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
