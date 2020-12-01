require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
	.catch((error) =>
		console.log("Something went wrong when retrieving an access token", error)
	);

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
	res.render("home");
});

app.get("/artist-search", (req, res) => {
	spotifyApi
		.searchArtists(req.query.search)
		.then((data) => {
			res.render("artist-search-results", { artists: data.body.artists.items });
		})
		.catch((err) =>
			console.log("The error while searching artists occurred: ", err)
		);
});

app.get("/albums/:id", (req, res) => {
	spotifyApi
		.getArtistAlbums(req.params.id)
		.then((data) => {
			res.render("albums", { albums: data.body.items });
		})
		.catch((err) =>
			console.log("The error while searching artists occurred: ", err)
		);
});

app.get("/tracks/:id", (req, res) => {
	spotifyApi
		.getAlbumTracks(req.params.id)
		.then((data) => {
			res.render("tracks", { tracks: data.body.items });
		})
		.catch((err) =>
			console.log("The error while searching artists occurred: ", err)
		);
});

app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
