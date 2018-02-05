var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');
app.use(morgan('dev'));

// Remember to paste here your credentials
var clientId = '947b1ba25ceb4742a4b23996462b02e2',
	clientSecret = '94c13bb862864e7c921e1347b4277e98';

var spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
	.then(function (data) {
		spotifyApi.setAccessToken(data.body['access_token']);
	}, function (err) {
		console.error('Something went wrong when retrieving an access token', err);
	});

app.get('/', (req, res) => {
	res.render('home');
});

app.post('/artists', (req, res) => {
	let input = req.body.input;
	spotifyApi.searchArtists(input).then((data) => {
		let artists = data.body.artists.items.map((artist) => {
			let url = artist.images.length ? artist.images[1].url : "/images/noImage.jpg";
			return { id: artist.id, name: artist.name, image: url }
		});
		res.render('image-list', { 'typeItem': 'artists' ,'input': input, 'items': artists });
	}).catch((err) => {
		console.error(err);
	});
});

app.get('/albums', (req, res) => {
	let input = req.query.itemName;
	spotifyApi.getArtistAlbums(req.query.itemId)
		.then((data) => {
			let albums = data.body.items.map((album) => {
				let url = album.images.length ? album.images[1].url : "/images/noImage.jpg";
				return { id: album.id, name: album.name, image: url }
			});
			res.render('image-list', { 'typeItem': 'albums', 'input': input, 'items': albums });
		}).catch((err) => {
			console.error(err);
		});
});

app.get('/tracks', (req, res) => {
	let input = req.query.itemName;
	spotifyApi.getAlbumTracks(req.query.itemId)
		.then((data) => {
			let tracks = data.body.items.map((track) => {
				return { 'title': track.name, 'preview': track.preview_url }
			});
			res.render('track-list', { 'input': input, 'items': tracks });
		}).catch((err) => {
			console.error(err);
		});
});

// Server Started
app.listen(3000, () => {
	console.log('App listening on port 3000!');
});