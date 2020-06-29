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
	.then(data => spotifyApi.setAccessToken(data.body['access_token']))
	.catch(error => console.log('Something went wrong when retrieving an access token', error));


//Route 1: Home Page
app.get("/", (req, res) => {
	res.render("homePage");
});

app.get("/artist-search", (req, res) => {
	const artist = req.query.artist;
	spotifyApi.searchArtists(artist)
	   .then((data) => {
		   res.render("artist-search-results", data.body)
	   })
	   .catch(error => console.log('Something went wrong when retrieving an access token', error));

})

app.get("/albums/:artistId", (req, res) => {
	const artistId = req.params.artistId;
	spotifyApi.getArtistAlbums(artistId)
	.then((data) => {
		res.render("albums", data.body)
	})
	.catch(error => console.log('Something went wrong when retrieving an access token', error));
})

app.get("/tracks/:albumId", (req, res) => {
	const albumId = req.params.albumId;
	spotifyApi.getAlbumTracks(albumId)
	.then((data) => {
		res.render("tracks", data.body)
	})
	.catch(error => console.log('Something went wrong when retrieving an access token', error));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
