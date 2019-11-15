//Exports
require('dotenv').config();

const SpotifyWebApi = require('spotify-web-api-node');
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

exports.home = (req, res) => {
	res.render('home');
};

exports.artists = (req, res) => {
	const { name } = req.query;
	spotifyApi
		.searchArtists(name)
		.then((data) => {
			console.log('The received data from the API: ', data.body.artists.items);
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			const artists = data.body.artists.items;
			res.render('artists', { artists });
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});
};

exports.albums = (req, res) => {
	const { artistId } = req.params;
	console.log(artistId);
	spotifyApi
		.getArtistAlbums(artistId)
		.then((data) => {
			console.log('The received data from the API: ', data.body.items);
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			const albums = data.body.items;
			res.render('albums', { albums });
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});
};

exports.tracks = (req, res) => {
	const { albumId } = req.params;
	console.log(albumId);
	spotifyApi
		.getAlbumTracks(albumId)
		.then((data) => {
			console.log('The received data from the API: ', data.body.items);
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			const tracks = data.body.items;
			res.render('tracks', { tracks });
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});
};
