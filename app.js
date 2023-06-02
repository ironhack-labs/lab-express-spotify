require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// https://developer.spotify.com/dashboard/840ee41555514a6cbaa880d2a893a01e/
// App name: IRONHACK-lab-express-spotify
// Redirect URI: http://not-used:3000/
// see .env

/************************/
/* Spotify API settings */
/************************/

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

// retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then(data => spotifyApi.setAccessToken(data.body['access_token']))
	.catch(error => console.log('Something went wrong when retrieving an access token', error));

/******************/
/* Express routes */
/******************/

app.get("/", (req, res, next) => {
	console.log("homepage requested")
	res.render("home-page")
})

app.get("/artist-search", (req, res, next) => {
	console.log("artist search page requested")
	spotifyApi
		.searchArtists(req.query.artist, { limit: 10, offset: 0 })
		.then(data => {
			// console.log(data.body);
			// console.dir(data.body, { depth: null }) // display nested objects instead of [Object]
			// console.dir(data.body, { depth: 3 })
			// console.log(data.body.artists.items)
			// res.render("artist-search-results", {artistsArr: data.body.artists.items})
			const artistsArr = {artistsArr: data.body.artists.items}
			res.render("artist-search-results", artistsArr)
		})
		.catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/artist-id-:artistId", (req, res, next) => {
	// console.log("albums page requested")
	spotifyApi
		.getArtistAlbums(req.params.artistId, { limit: 10, offset: 0 })
		.then(data => {
			// console.log(data.body);
			// console.dir(data.body, { depth: null }) // display nested objects instead of [Object]
			// console.dir(data.body, { depth: 3 })
			// res.render("albums", {albumsArr: data.body.items})
			const albumsArr = {albumsArr: data.body.items}
			res.render("albums", albumsArr)
		})
		.catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get("/tracks/album-id-:albumId", (req, res, next) => {
	// console.log("tracks page requested")
	spotifyApi
		.getAlbumTracks(req.params.albumId, { limit: 10, offset: 0 })
		.then(data => {
			// console.log(data.body);
			// console.dir(data.body, { depth: null }) // display nested objects instead of [Object]
			// console.dir(data.body, { depth: 3 })
			// res.render("tracks", {tracksArr: data.body.items})
			const tracksArr = {tracksArr: data.body.items}
			res.render("tracks", tracksArr)
		})
		.catch(err => console.log('The error while searching tracks occurred: ', err));
})

/******************/
/* Express listen */
/******************/

const port = 3010
app.listen(port, () => console.log(`
	My Spotify project running on port ${port} 🎧 
	http://localhost:${port} or http://127.0.0.1:${port}`));
