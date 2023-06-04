/** @format */

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
	clientId: "298f1555521342328a458040d5fba01c",
	clientSecret: "c7b7199b700f48f4be68135533844a92",
});
// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => {
		spotifyApi.setAccessToken(data.body["access_token"]);
	})
	.catch((error) =>
		console.log("Something went wrong when retrieving an access token", error)
	);

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//
// Our routes go here:

app.get("/", (req, res, next) => {
	res.render("home-page");
});

app.get("/artist-search", (req, res, next) => {
	const artists = req.query.artist;

	spotifyApi
		.searchArtists(artists)
		.then((data) => {
			const artistsArray = data.body.artists.items;
			res.render("artists-search-results", { artistsArray });
		})
		.catch((error) =>
			console.log("There was an error on searching for artists", error)
		);
});

app.get("/albums/:artistId", (req, res, next) => {
	const artistId = req.params.artistId;

	spotifyApi
		.getArtistAlbums(artistId)
		.then((data) => {
			const albumsArray = data.body.items;
			res.render("albums", { albumsArray });
		})

		.catch((error) =>
			console.log("There was an error on searching for albums", error)
		);
});

app.get("/tracks/:albumId", (req, res, next) => {
	const albumId = req.params.albumId;

	spotifyApi
		.getAlbumTracks(albumId)
		.then((data) => {
			const tracksArray = data.body.items;

			res.render("tracks", { tracksArray });
		})
		.catch((error) =>
			console.log("There was an error on searching for tracks", error)
		);
});

app.listen(3004, () =>
	console.log("My Spotify project running on port 3004 🎧 🥁 🎸 🔊")
);
