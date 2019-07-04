const SpotifyWebApi = require('spotify-web-api-node');
const clientId = process.env.SPOTIFY_ID;
const clientSecret = process.env.SPOTIFY_SECRET;

const spotifyApi = new SpotifyWebApi({
	clientId,
	clientSecret,
});
spotifyApi
	.clientCredentialsGrant()
	.then((data) => {
		spotifyApi.setAccessToken(data.body['access_token']);
	})
	.catch((error) => {
		console.log('Something went wrong when retrieving an access token', error);
	});

exports.index = async (req, res, next) => {
	res.render('index');
};

exports.search = async (req, res, next) => {
	spotifyApi
		.searchArtists(req.query.searchArtist)
		.then((data) => {
			res.render('search', data.body.artists);
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});
};

exports.artist = async (req, res, next) => {
	spotifyApi
		.getArtistAlbums(req.params.artistId)
		.then((data) => {
			res.render('artists', data.body);
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});
};

exports.albums = async (req, res, next) => {
	spotifyApi
		.getAlbumTracks(req.params.album)
		.then((data) => {
			res.render('album', data.body);
		})
		.catch((err) => {
			console.log('The error while searching artists occurred: ', err);
		});
};
