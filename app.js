require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
        console.log('Works');
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
app.get("/", (req, res, next) => {
	spotifyApi.searchArtists('madonna')
	.then((data) => {
		console.log(data.body.artists) 
            //For accesing the data:
            //nodemon app.js
            //Refresh the page (localhost3000)
	})
	.catch(error => console.log(error))
})

// Our routes go here:

app.get("/home-page", (req, res, next) => {
    res.render("home-page");
});


app.get("/artist-search/:artistName", (req, res, next) => {

    console.log(req.params.artistName);

	spotifyApi
    .searchArtists({title: req.params.artistName})/*data.body. ...*/
	.then((data) => {
		console.log('We have received data from the API', data.body) 
            //For accesing the data:
            //nodemon app.js
            //Refresh the page (localhost3000)

        })
        res.render("artist-search-results.hbs")
	.catch(error => console.log('The error while searching artists occurred: ', error))
})















app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
