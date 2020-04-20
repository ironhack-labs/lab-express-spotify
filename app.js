require('dotenv').config();
require('./helpers/helper');

const express = require('express');
const path = require('path');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wront when retrieving an access token', error));

// Our routes go here:
// app.use('/', require('./routes/main'));

app.get('/', (req, res, next) => {
	res.render('index', {
		index: true,
	});
});

app.get('/artist-search', (req, res, next) => {
	spotifyApi
		.searchArtists(req.query.artist_name)
		.then((data) => {
			res.render('artist-search-result', {
				data: data.body.artists,
				wraper: 'list',
			});
		})
		.catch((error) => next(error));
});

app.get('/albums/:artistId', (req, res, next) => {
	spotifyApi
		.getArtistAlbums(req.params.artistId)
		.then((result) => {
			res.render('albums', {
				albums: result.body.items,
				wraper: 'list albums',
			});
		})
		.catch((err) => next(err));
});

app.get('/album/:albumId', (req, res, next) => {
	spotifyApi
		.getAlbumTracks(req.params.albumId)
		.then((result) => {
			console.log(result.body);
			res.render('album-tracks', {
				album: result.body.items,
				wraper: 'list album',
			});
		})
		.catch((err) => next(err));
});

app.use(function (req, res, next) {
	res.status(404).render('not_found');
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
