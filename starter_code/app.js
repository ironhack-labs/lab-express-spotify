require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

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
		console.log("successfully retreived Access Token at " + (new Date()));
	})
	.catch((error) => {
		console.log('Something went wrong when retrieving an access token', error);
	});

// the routes go here:
app.get('/', (req, res, next) => {
	res.render('index');
});

app.get('/artists', (req, res, next) => {
	spotifyApi
		.searchArtists(req.query.artist)
		.then(data => {
			let artistResult = data;
			res.render('artists', { artistResult });
		})
		.catch(err => {
			console.error(err);
			res.render('index');
		});
});

app.get("/albums/:artistId", (req, res, next) => {

	spotifyApi
		.getArtistAlbums(req.params.artistId)
		.then(data => {
			let albumResult = data;
			res.render('albums', { albumResult });
		})
		.catch(err => {
			console.log('The error while searching albums occurred: ', err);
			res.render('index');
		});

})

app.get("/tracks/:albumId", (req, res, next) => {

	spotifyApi
		.getAlbumTracks(req.params.albumId)
		.then(data => {
			let tracksResult = data;
			res.render('tracks', { tracksResult });
		})
		.catch(err => {
			console.log('The error while searching albums occurred: ', err);
			res.render('index');
		});

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
