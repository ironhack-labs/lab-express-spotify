const dotenv = require("dotenv").config();
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then(data => {
		spotifyApi.setAccessToken(data.body["access_token"]);
		console.log("Connected to Spotify");
	})
	.catch(error => {
		console.log("Something went wrong when retrieving an access token", error);
	});

// the routes go here:

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/artists", (req, res) => {
	console.log(req.query);
	let artist = req.query.artist;

	spotifyApi
		.searchArtists(artist)
		.then(data => {
			console.log("The received data from the API: ", data.body);
			let artistList = data.body.artists.items;
			res.render("artists", { artistList });
		})
		.catch(err => {
			console.log("The error while searching artists occurred: ", err);
		});
});

app.get("/albums/:artistId", (req, res) => {
	let artistId = req.params.artistId;

	spotifyApi.getArtistAlbums(artistId).then(
		function(data) {
			console.log("Artist albums", data.body);
			let albumList = data.body.items;
			res.render("albums", { albumList });
		},
		function(err) {
			console.error("The error while searching albums occurred: ", err);
		}
	);
});

app.get("/tracks/:albumId", (req, res) => {
	let albumId = req.params.albumId;

	spotifyApi.getAlbumTracks(albumId, { offset: 1 }).then(
		function(data) {
			let trackList = data.body.items;
			// console.log(data.body);
			res.render("tracks", { trackList });
		},
		function(err) {
			console.log("Something went wrong!", err);
		}
	);
});

app.listen(3001, () => console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊"));
