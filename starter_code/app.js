require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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
		// console.log('Something went wrong when retrieving an access token', error);
	});

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//   get artists
spotifyApi
	.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
	.then((data) => {
		// console.log('The received data from the API: ', data.body);
		// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
	})
	.catch((err) => {
		// console.log('The error while searching artists occurred: ', err);
	});

// the routes go here:

app.get('/', (req, res, next) => {
	console.log('======', req.query.query);
	res.render('index', { query: req.query });
});

app.get('/artists', (req, res, next) => {
	spotifyApi
		.searchArtists(req.query.artistName)
		.then((data) => {
			// console.log('The received data from the API: ', data.body.artists.items);
			let results = data.body.artists.items;
			res.render('artists', { results });
		})
		.catch((err) => {
			// console.log('The error while searching artists occurred: ', err);
		});
});

app.get('/albums/:artistId', (req, res, next) => {
	spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
		// console.log('Artist albums', data);
		let results = data;
		// console.log(results.body.items, 'helloo');
		res.render('albums', { results });
	}, function(err) {
		// console.error(err);
	});
});

app.get('/tracks/:trackId', (req, res, next) => {
	spotifyApi.getAlbum(req.params.trackId).then((data) => {
		let results = data.body.tracks.items;
		console.log(results);
		res.render('tracks', { results });
	});
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
