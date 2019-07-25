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
        console.log("The received data from the API: ", data.body.artists.items)
        res.render('artists', data.body)
      }, function(err) {
        console.error(err)
      })
    
    console.log(req.query.artist)
})


  

module.exports = app;


app.listen(process.env.PORT, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
