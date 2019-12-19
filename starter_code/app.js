require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then(data => {
	spotifyApi.setAccessToken(data.body['access_token']);
	})
	.catch(error => {
	console.log('Something went wrong when retrieving an access token', error);
	});


// the routes go here:
app.get('/', function (req, res) {
  	res.render("index");
})

app.get('/artists', function (req, res){
	spotifyApi
		.searchArtists(req.query.artists)
		.then(data => {
			// console.log(`Search artists: ${req.query.artists}`, data.body);
			const items = data.body.artists.items;
			// res.send( {items });
			res.render("artists", { items });
		})
		.catch(err => {
			console.error(err);
		});
		
	// res.send(req.query.artists);
})

// Get an artist


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
