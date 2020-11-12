require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node")

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

// Our routes go here:

app.get("/",(req, res, next)=>{
res.render("index")
// console.log("Hey1")
})

app.get("/artist-search", (req, res, next) => {

	//How to avoid people leaving the form in blank?
	
	spotifyApi.searchArtists(req.query.searchArtist)
	
        .then(artist => {
            res.render('artist-search-results', {artists: artist.body.artists.items })
		})
		
		.catch((err)=>{
			console.log(err)
		})

		//console.log(Hey2!!)
})

app.get('/albums/:id', (req, res, next) => {

	spotifyApi.getArtistAlbums(req.params.id)
	
        .then(albums => {
            res.render('albums', { albums: albums.body.items })
        })
		.catch((err)=>{
			console.log(err)
		})
})

app.get('/tracks/:id', (req, res, next) => {

	spotifyApi.getAlbumTracks(req.params.id)
	
        .then(track => {
            res.render('tracks', { tracks: track.body.items })
		})
		.catch((err)=>{
			console.log(err)
		})
	
})


app.listen(5555, () => console.log('My Spotify project running on port 5555 🎧 🥁 🎸 🔊'));
