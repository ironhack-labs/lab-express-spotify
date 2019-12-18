require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => {
		spotifyApi.setAccessToken(data.body['access_token']);
	})
	.catch((error) => {
		console.log('Something went wrong when retrieving an access token', error);
	});

// the routes go here:
app.get('/', (req, res, next) => {
	res.render('index');
});

app.get('/artists', (req, res, next) => {
	console.log('hello')
	res.render('artists');
})

// app.get("/artists", (req, res) => {
// 	spotifyApi
// 		.searchArtists(req.query.artist)
// 		.then(searchResponse => {
// 			const { artists } = searchResponse.body;
// 			res.render("artists", artists);
// 		})
// 		.catch(err => {
// 			console.log("The error while searching artists occurred: ", err);
// 		});
// });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
