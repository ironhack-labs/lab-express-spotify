const SpotifyWebApi = require('spotify-web-api-node'),
	bodyParser = require('body-parser'),
	prettyJson = require('prettyjson'),
	express = require('express'),
	morgan = require('morgan'),
	hbs = require('hbs'),
	app = express();

const clientSecret = '68cf1a54429e48d4be74d31e56be22cf',
	clientId = '91935b5227aa4f0db0bc270357da1517';

const spotifyApi = new SpotifyWebApi({
	clientSecret: clientSecret,
	clientId: clientId
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
	.then((data) => {
		spotifyApi.setAccessToken(data.body['access_token']);
	}, (err) => {
		console.log('Something went wrong when retrieving an access token', err);
	});

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {
	res.render('index', {});
});


app.get('/artists', (req, res, next) => {
	const name = req.query.artist;
	spotifyApi.searchArtists(name)
		.then(data => {
			const artists = data.body.artists.items;
			res.render('artists', {artists, title: name});
		})
		.catch(err => {
			console.log('Error', err);
		})
});

app.get('/albums/:artistId', (req, res) => {
	const artistId = req.params.artistId;
	let name = '';
	
	spotifyApi.getArtist (artistId)
		.then(data => { 
			name = data.body.name
		})
		.catch(err => {
			console.log('Error', err);
		})

	spotifyApi.getArtistAlbums(artistId)
		.then(data => {
			const albums = data.body.items;
			res.render('albums', {albums, title: `Albums for ${name}`});
		})
		.catch(err => {
			console.log('Error', err);
		})
});

app.get('/tracks/:albumId', (req, res) => {
	const albumId = req.params.albumId;

	spotifyApi.getAlbumTracks(albumId)
		.then(data => {
			const tracks = data.body.items;
			console.log(data.body.items);
		 	res.render('tracks', {tracks});
		})
		.catch(err => {
			console.log('Error', err);
		})
});

app.listen(3000, () => {
    console.log('My first app listening on port 3000!')
});