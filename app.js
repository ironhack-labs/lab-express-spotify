require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) =>
		console.log('Something went wrong when retrieving an access token', error)
	);

app.get('/', (req, res, next) => res.render('index'));

app.get('/artist-search', (req, res, next) => {
	spotifyApi
		.searchArtists(`${req.query.search}`)
		.then((data) => {
			let artistSearchDTO = [];
			data.body.artists.items.forEach((artist) => {
				let artistDTO = {
					id: artist.id,
					name: artist.name,
					image: 'http://localhost:3000/images/spotify-background.jpg',
				};
				let image = artist.images.filter((img) => img.width === 300);
				if (image.length > 0) {
					artistDTO.image = image[0].url;
				} else {
					image = artist.images.filter((img) => img.width === 64);
					if (image.length > 0) {
						artistDTO.image = image[0].url;
					}
				}
				artistSearchDTO.push(artistDTO);
			});
			res.render('artist-search-results', { artistSearchDTO });
		})
		.catch((err) =>
			console.log('The error while searching artists occurred: ', err)
		);
});

app.get('/albums/:artistName/:artistId', (req, res, next) => {
	let albumsDTO = {
		artistName: req.params.artistName,
		albums: [],
	};
	spotifyApi
		.getArtistAlbums(req.params.artistId)
		.then((data) => {
			//console.log('The received data from the API: ', data.body);
			data.body.items.forEach((album) => {
				let albumDTO = {
					id: album.id,
					name: album.name,
					image: 'http://localhost:3000/images/spotify-background.jpg',
				};
				let image = album.images.filter((img) => img.width === 300);
				if (image.length > 0) {
					albumDTO.image = image[0].url;
				} else {
					image = artist.images.filter((img) => img.width === 64);
					if (image.length > 0) {
						albumDTO.image = image[0].url;
					}
				}
				albumsDTO.albums.push(albumDTO);
			});
			res.render('albums', albumsDTO);
		})
		.catch((err) =>
			console.log('The error while searching artists occurred: ', err)
		);
});

app.get('/tracks/:artistName/:albumName/:albumId', (req, res, next) => {
	let tracksDTO = {
		artistName: req.params.artistName,
		albumName: req.params.albumName,
		tracks: [],
	};
	spotifyApi
		.getArtistAlbums(req.params.artistId)
		.then((data) => {
			//console.log('The received data from the API: ', data.body);
			data.body.items.forEach((album) => {
				let albumDTO = {
					id: album.id,
					name: album.name,
					image: 'http://localhost:3000/images/spotify-background.jpg',
				};
				let image = album.images.filter((img) => img.width === 300);
				if (image.length > 0) {
					albumDTO.image = image[0].url;
				} else {
					image = artist.images.filter((img) => img.width === 64);
					if (image.length > 0) {
						albumDTO.image = image[0].url;
					}
				}
				albumsDTO.albums.push(albumDTO);
			});
			res.render('tracks', albumsDTO);
		})
		.catch((err) =>
			console.log('The error while searching artists occurred: ', err)
		);
});

app.listen(3000, () =>
	console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
