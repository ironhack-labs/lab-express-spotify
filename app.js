require("dotenv").config()

const express = require("express")
const hbs = require("hbs")
const bodyParser = require("body-parser")
const app = express()
const SpotifyWebApi = require("spotify-web-api-node")
app.use(bodyParser.urlencoded({ extended: false }))

// require spotify-web-api-node package here:

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
  res.render("home")
})
app.get("/artist-search", (req, res) => {
  const query = req.query.q
  // return spotifyApi
  spotifyApi
    .searchArtists(query)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items)
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const firstPage = data.body.artists.items
      res.json(`artist-search-results`, { artists: items })
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    )
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
)
