require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
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

// route to home page
app.get("/", (req, res) => {
	res.render("home");
});

// route for searching for an artist
app.get("/artist-search", (req, res) => {
	const artistSearch = req.query.artist;

	spotifyApi
		.searchArtists(artistSearch)
		.then((data) => {
			const artistsArr = data.body.artists.items;

			res.render("artist-search-results.hbs", { artistsArr });
		})
		.catch((err) => console.log("something went wrong", err));
});

app.get("/artist/:artistId/albums", (req, res) => {
	const artistId = req.params.artistId;

	spotifyApi
		.getArtistAlbums(artistId)
		.then((data) => {
			const albumArr = data.body.items;

			res.render("albumList.hbs", { albumArr });
		})
		.catch((err) => console.log(err));
});

app.get("/album/:albumId/tracks", (req, res) => {
	const albumId = req.params.albumId;
	spotifyApi
		.getAlbumTracks(albumId)
		.then((data) => {
			const albumArr = data.body.items;
			res.render("tracks.hbs", { albumArr });
			console.log(albumArr);
		})
		.catch((err) => console.log(err));
});

app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
