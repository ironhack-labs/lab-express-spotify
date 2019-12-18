require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// credentials are optional
// const spotifyApi = new SpotifyWebApi({
//   clientId: '6f0d077187a5464082bfcfcdf7781cd0',
//   clientSecret: '690539c32d8442e7ac07f856355fc148',
//   redirectUri: 'http://www.example.com/callback'
// });


// the routes go here:
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


app.get('/', function (req, res) {
  	res.render("index");
})

app.get('/artists', function (req, res){
	// Search artists whose name contains 'Love'
	spotifyApi.searchArtists('Love')
		.then(function(data) {
		console.log('Search artists by "Love"', data.body);
		}, function(err) {
		console.error(err);
		});
		
	res.send(req.query);
})




// Get an artist


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
