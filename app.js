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
})

/******************/
/* Express listen */
/******************/

const port = 3010
app.listen(port, () => console.log(`
	My Spotify project running on port ${port} 🎧 
	http://localhost:${port} or http://127.0.0.1:${port}`));
