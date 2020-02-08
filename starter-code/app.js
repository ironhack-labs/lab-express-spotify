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
	clientSecret: process.env.CLIENT_SECRET
});


// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then(data => spotifyApi.setAccessToken(data.body["access_token"]))
	.catch(error =>
		console.log("Something went wrong when retrieving an access token", error)
	);


// Our routes go here:
app.get("/", (req, res, next) => {
	res.render("index");
});


app.get("/artist-search", (req, res) => {
	console.log("artista", req.query.artist);
	const artista = req.query.artist;

	spotifyApi
		.searchArtists(artista)
		.then( function (data) {
			console.log("Found artist", data.body.artists.items);
			const artistsList = data.body.artists.items;
			res.render("artist-search-results", {
				artistsList
			});
		},
		function (err) {
			console.error(err);
		}
	);
});


app.get("/albums/:artistId", (req, res, next) => {
	console.log("artist", req.query.artistId); //=> find albums adress
	const lastPartOfUrlakaArtisId = req.params.artistId;

	spotifyApi
		.getArtistAlbums(lastPartOfUrlakaArtisId)
		.then(function (data) {
			const albumsList = data.body.items;
			// console.log("Found album", data.body);			 
			res.render("albums.hbs", { albumsList
			});
		},
		function (err) {
			console.error(err);
		}
	);
});


app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
