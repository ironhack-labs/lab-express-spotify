require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

//HBS SETUP
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");


//MIDDLEWARE
//Lets us pass all of the functions and stuff through express
app.use(express.static(__dirname + "/public"));


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
	const artistaObj = req.query.artist;

	//Getting info with SpotifyAPI
	spotifyApi
		.searchArtists(artistaObj)
		.then(responseFromAPI => {
				// console.log("Data received from API about artist", responseFromAPI.body.artists.items);
				const artistsList = responseFromAPI.body.artists.items;

				res.render("artist-search-results", {
					artistsList
				});
			},
			function (err) {
				console.error(err);
			}
		);
});
//

app.get("/albums/:artistId", (req, res, next) => {
	// console.log("artist", req.query.artistId); //=> find albums adress
	const lastPartOfUrlakaArtistId = req.params.artistId;

	spotifyApi
		.getArtistAlbums(lastPartOfUrlakaArtistId)
		.then(responseFromAPI => {
				const albumsList = responseFromAPI.body.items;
				// console.log("Found album", data.body);			 
				res.render("albums.hbs", {
					albumsList
				});
			},
			function (err) {
				console.error(err);
			}
		);
});


app.get("/tracks/:albumId", (req, res, next) => {
	// console.log("ALBUM", req.query.albumId);
	const albumId = req.params.albumId;

	spotifyApi
		.getAlbumTracks(albumId)
		.then(response => {
				// console.log("Album tracks", response.body.items);
				const tracksList = response.body.items;
				//Song preview URL : 
				// console.log("preview_url":, response.body.items[0].preview_url);
				res.render("tracks", {
					tracksList
				});
			},
			function (err) {
				console.log('Something went wrong!', err);
			});
});


app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);