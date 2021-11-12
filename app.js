require("dotenv").config()

const express = require("express")
const hbs = require("hbs")

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch(err =>
        console.log("Something went wrong when retrieving an access token", err)
    )

app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/public"))

// setting the spotify-api goes here:

// Our routes go here:

app.get("/", (req, res) => {
    res.render("index", { doctitle: "Homepage" })
})

app.get("/artist-search", (req, res) => {
    const searched = req.query.q
    spotifyApi
        .searchArtists(searched.toLowerCase())
        .then(data => {
            res.render("search", {
                artists: data.body.artists.items,
                searched: searched,
                doctitle: "Search result",
            })
        })
        .catch(err =>
            console.log("The error while searching artists occurred: ", err)
        )
})

app.get("/artists/:artistId", (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            res.render("artist", {
                albums: data.body.items,
                artist: data.body.items[0].artists[0].name,
                doctitle: data.body.items[0].artists[0].name,
            })
        })
        .catch(err => console.log(err))
})

app.get("/albums/:albumId", (req, res) => {
    spotifyApi
        .getAlbum(req.params.albumId)
        .then(data => {
            res.render("album", {
                artist: data.body.artists[0].name,
                album: data.body.name,
                tracks: data.body.tracks.items,
                doctitle: `${data.body.artists[0].name} - ${data.body.name}`,
            })
        })
        .catch(err => console.log(err))
})

app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
)
