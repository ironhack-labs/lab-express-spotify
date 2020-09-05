require("dotenv").config()

const express = require("express")
const hbs = require("hbs")
const SpotifyWebApi = require("spotify-web-api-node")

// require spotify-web-api-node package here:

const app = express()

app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
hbs.registerPartials("/views/partials")
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

// Business Logic

// Our routes go here:

app.get("/", (req, res) => {
	res.render("index", { page: "Homepage" })
})

/* app.get("/artist-search", (req, res) => {
	res.render("artist-search-results", { artists: "Kev" })
}) */

app.get("/artist-search", async (req, res) => {
	let getArtist = await spotifyApi
		.searchArtists(req.query.name)
		.then((val) => {
			return val.body.artists.items
		})
		.catch((err) => console.log("Something went wrong by getting the Artists: ", err))
	console.log(getArtist)
	res.render("artist-search-results", { artists: getArtist })
})

app.get("/albums/:id", async (req, res) => {
	console.log()
	await spotifyApi
		.getArtistAlbums(req.params.id)
		.then((val) => {
			console.log(val.body.items)
			res.render("albums", { albums: val.body.items })
		})
		.catch((err) => console.log("Something went wrong by getting the Albums: ", err))
})

app.get("/album/:id", async (req, res) => {
	console.log()
	await spotifyApi
		.getAlbumTracks(req.params.id)
		.then((val) => {
			console.log(val.body.items)
			res.render("tracks", { tracks: val.body.items })
		})
		.catch((err) => console.log("Something went wrong by getting the Albums: ", err))
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"))
