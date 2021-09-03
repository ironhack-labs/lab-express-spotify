require('dotenv').config();

// Iteracion #2
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// partials
//hbs.registerPartials(`${__dirname}/views/partials`);

// Iteración #1
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Iteración #3
// Our routes go here:
// Index route
app.get('/', (req, res) => {
	res.render('index');
	//console.log('Hi');
	//console.log(__dirname);
});

// Artist route
// 3h he estado haciendo el mongoloDB hasta que he visto que el require de la línia #1 estaba comentada...
app.get('/artist-search', (req, res) => {
	// Si no pasan artista, reload al index (redirect al index)
	if (!req.query.artist) {
		res.redirect('/');
	}
	spotifyApi
		.searchArtists(req.query.artist)
		.then((data) => {
			//console.log('The received data from the API: ', data.body.artists.items);
			res.render('artist-search-results', { data: data.body.artists.items });
			//res.render('artist-search-results', { data });
			//res.send({ data: data.body.artists.items });
		})
		.catch((err) => console.log('Error when getting artists: ', err));
});

// Iteration #4
app.get('/albums/:albumId', (req, res) => {
	spotifyApi
		.getArtistAlbums(req.params.albumId)
		.then((data) => {
			//console.log('The received data from the API: ', data.body.items);
			res.render('albums', {
				data: data.body.items
			});
			// res.send({
			// 	data: data.body.items
			// });
		})
		.catch((err) => console.log('Error when getting albums: ', err));
});

// Iteration #5
app.get('/albums/tracks/:albumId', (req, res) => {
	spotifyApi
		.getAlbumTracks(req.params.albumId)
		.then((data) => {
			console.log(data.body.items);
			res.render('tracks', {
				data: data.body.items
			});
			// res.send({
			// 	data: data.body.items
			// });
		})
		.catch((err) => {
			console.log('Error when getting tracks', err);
		});
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
