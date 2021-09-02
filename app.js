require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then(data => spotifyApi.setAccessToken(data.body['access_token']))
	.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
	res.render('index');
	});

app.get('/artist-search', (req, res) => {
	//console.log ("request: " + req.query.name)
  let artistToSearch = req.query.name
	spotifyApi
  .searchArtists(artistToSearch)
  .then(data => {
/* 	The received data from the API:  {
		href: 'https://api.spotify.com/v1/search?query=extremoduro&type=artist&offset=0&limit=20',
		items: [
		  {
			external_urls: [Object],
			followers: [Object],
			genres: [Array],
			href: 'https://api.spotify.com/v1/artists/3bgsNtcf5d5h9jbQbohfBK',
			id: '3bgsNtcf5d5h9jbQbohfBK',
			images: [Array],
			name: 'Extremoduro',
			popularity: 66,
			type: 'artist',
			uri: 'spotify:artist:3bgsNtcf5d5h9jbQbohfBK'
		  },
...
		]
	  } */
	let artistsArray = data.body.artists.items;
    console.log('The received data from the API: ', artistsArray);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
	res.render('artist-search-results', {artistsArray});
	})
  .catch(err => console.log('The error while searching artists occurred: ', err));
	});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
