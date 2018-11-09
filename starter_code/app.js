
//################# SPOTIFY API SETUP #################

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'd1e9d9dd513f48c5bb1aa2b4ff118709',
    clientSecret = '96bc8e9c14e748419969b64bab8e3e0c';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

//################### APP SETUP ######################

const express = require("express");
const app = express();
const hbs = require("hbs");

app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");

app.listen(3000, () => {
	console.log("app running")
});

var currentArtist;
var currentAlbum;



//#################### ROUTES ########################

app.get("/", (request, response, next) => {
	response.render("home-page.hbs");
});

app.get("/artists", (request, response, next) => {
	const aSearch = request.query.artist;
	let returnData;

	spotifyApi.searchArtists(aSearch)
    .then(data => {
    	returnData = data.body.artists.items;
    	response.locals.artistList = returnData;


    	
    	// response.send(data);
    	response.render("artist-list.hbs");
    })
    .catch(err => {
    	console.log("query error", err);
    });

})



app.get("/albums/:artistId", (request, response, next) => {
	const artistId = request.params.artistId;
	let returnData;
	console.log(artistId); 

	spotifyApi.getArtistAlbums(artistId)
		.then(data => {
			returnData = data.body.items;

			response.locals.albumList = returnData;

			// response.send(data);
			response.render("album-list.hbs");
		})
		.catch(err => {
			console.log("album search error", err);
		});
})

app.get("/tracks/:albumId", (request, response, next) => {
	const albumId = request.params.albumId;
	let returnData;

	spotifyApi.getAlbumTracks(albumId)
		.then(data => {
			returnData = data.body.items;

			response.locals.trackList = returnData;

			// response.send(data);
			response.render("track-list.hbs")
		})
		.catch(err => {
			console.log("track search error", err);
		});

})