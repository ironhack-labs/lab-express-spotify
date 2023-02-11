require('dotenv').config();
const port = 3001;

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/artist-search', (req, res) => {
	spotifyApi
		.searchArtists(req.query.artist)
		.then((data) => {
			// console.log('The received data from the API: ', data.body);
			// res.json(data.body);
			// ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			let allArtists = data.body.artists.items;
			console.log(data.body.artists.items[0].id);

			res.render('artist-search-results', { allArtists });
		})
		.catch((err) => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res, next) => {
	spotifyApi.getArtistAlbums(req.params.id).then((data) => {
		let allAlbums = data.body.items;
		res.render('albums', { allAlbums });
	});
});

app.get('/tracks/:id', (req, res, next) => {
	spotifyApi.getAlbumTracks(req.params.id).then((data) => {
		let allTracks = data.body.items;
		res.render('tracks', { allTracks });
	});
});

app.listen(port, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
