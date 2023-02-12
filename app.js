require("dotenv").config()

const express = require("express")
const hbs = require("hbs")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node")

// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/public"))

// setting the spotify-api goes here:

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  )

// Our routes go here:

app.get("/", (req, res) => {
  res.render(__dirname + "/views/home.hbs")
})
/* spotifyApi.searchArtists("Love").then(
  function (data) {
    console.log('Search artists by "Love"', data.body)
  },
  function (err) {
    console.error(err)
  }
)
 */
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
)
