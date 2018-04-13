var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');


const app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

// Remember to paste here your credentials
var clientId = '432f74a7063b4eb3ac546a95f4fa1672',
	clientSecret = '3ee11279d5b04d7fba728c3bfd32cac5';

var spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret
});

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/artists', function(req, res) {
	let { artistName } = req.body;

	spotifyApi
		.searchArtists(artistName)
		.then((data) => {
            let artistList = data.body.artists.items;
            console.log(artistList)
			res.render('artists', { artistList });
		})
		.catch((err) => {
			console.log(err);
		});
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
	function(data) {
		spotifyApi.setAccessToken(data.body['access_token']);
	},
	function(err) {
		console.log('Something went wrong when retrieving an access token', err);
	}
);

const port = 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
