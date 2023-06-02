require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => {
		spotifyApi.setAccessToken(data.body['access_token']);
		console.log('Worked', data.body['access_token']);
	})

	.catch((error) =>
		console.log('Something went wrong when retrieving an access token', error)
	);

// setting the spotify-api goes here:

const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:

app.get('/artists', async (req, res, next) => {
	console.log('artists gotten: ', req.query.artistInfo);
	try {
		const artists = await spotifyApi.searchArtists(req.query.artistInfo);
		const artistsArray = artists.body.artists.items;
		res.render('artist-search-results', { artistsArray });
	} catch (error) {
		console.log('Error while searching artists: ', error);
	}
});

app.get('/albums/:artistId', async (req, res, next) => {
	/* console.log(req.params.artistId); */
	const artistId = req.params.artistId;

	try {
		const artistAlbums = await spotifyApi.getArtistAlbums(artistId);
		/* console.log(artistAlbums.body.items[0]); */
		const artistAlbumsArray = artistAlbums.body.items;
		res.render('albums', { artistAlbumsArray });
	} catch (error) {
		console.log('Unexpected error: ', error);
	}
});

app.get('/tracks/:tracksId', async (req, res, next) => {
	const tracksId = req.params.tracksId;
	/* console.log(tracksId); */

	try {
		const artistTracks = await spotifyApi.getAlbumTracks(tracksId);
		/* console.log(artistTracks.body.items); */
		const artistTracksObj = artistTracks.body.items;
		res.render('album-tracks', { artistTracksObj });
	} catch (error) {
		console.log(error);
	}
});

app.get('/', (req, res, next) => {
	res.render(__dirname + '/views/home-page');
});

app.listen(3000, () =>
	console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
