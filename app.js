require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
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

// Our routes go here:
app.get("/", (req, res, next) => {
	res.render("index");
});

app.get("/search-results", (req, res, next) => {
	spotifyApi
		.searchArtists(req.query.search)
		.then((data) => {
			/* console.log("The received data from the API: ", data.body.artists.items); */
			res.render("search-results", { artist: data.body.artists.items });
		})
		.catch((err) =>
			console.log("The error while searching artists occurred: ", err)
		);
});

app.get("/albums/:artistsId", (req, res, next) => {
	spotifyApi
		.getArtistAlbums(req.params.artistsId)
		.then((data) => {
			console.log("Artist albums", data.body.items);
			res.render("albums", { albums: data.body.items });
		})
		.catch((err) =>
			console.log("The error while searching artists occurred: ", err)
		);
});

app.get("/tracks/:trackId", (req, res, next) => {
	spotifyApi
		.getAlbumTracks(req.params.trackId)
		.then((data) => {
			console.log("Album tracks", data.body.items);
			res.render("tracks", { tracks: data.body.items });
		})
		.catch((err) =>
			console.log("The error while searching artists occurred: ", err)
		);
});

/* app.get("/artist-search", (req, res, next) => {
	res.render("artist-search", req.query);
}); */

app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
