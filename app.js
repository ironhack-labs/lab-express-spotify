require("dotenv").config()

const express = require("express")
const hbs = require("hbs")

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node")

const app = express()

app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/public"))

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
	.catch((error) => console.log("Something went wrong when retrieving an access token", error))

// Our routes go here:

app.get("/", (req, res) => {
	res.render("index")
})

app.get("/artist-search", (req, res) => {
	// console.log(req.query.artist)
	spotifyApi
		.searchArtists(req.query.artist)
		.then((data) => {
			// console.log("The received data from the API: ", data.body.artists.items[0])

			res.render("artist-search-results", { data: data.body.artists.items })
		})
		.catch((err) => console.log("The error while searching artists occurred: ", err))
})

app.get("/albums/:artistId", (req, res, next) => {
	// console.log(req.params)
	spotifyApi.getArtistAlbums(req.params.artistId).then((albums) => {
		// res.send(albums)
		res.render("albums", albums.body)
		// res.send(albums.body)
	})
})

app.get("/album/:albumId", (req, res, next) => {
	spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
		res.render("tracks", data.body)
	})
	// console.log(req.params.albumId)
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"))
