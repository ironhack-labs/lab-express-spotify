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

app.get('/', (req, res, next) => {
	res.render('index', {
		// title: title.home
	});
});

app.get('/artists', (req, res, next) => {
	const request = req.query;
	console.log(request);
	spotifyApi.searchArtists(request)
		.then(data => {
			// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			console.log(data);
		})
		.catch(err => {
			// ----> 'HERE WE CAPTURE THE ERROR'
		})
});

app.listen(3000, () => {
    console.log('My first app listening on port 3000!')
});