require('dotenv').config();

const express = require('express');
const hbs = require('hbs');






const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });


  // setting the spotify-api goes here:
spotifyApi
.clientCredentialsGrant()
.then(data => {
spotifyApi.setAccessToken(data.body['access_token'])
})
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// require spotify-web-api-node package here:
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');



app.get("/", (req, res, next) => {
    
    res.render("artist-search");
})


app.get("/artist-search", (req, res, next) => {
    
    spotifyApi.searchArtists(req.query.artists)
	.then((ref) => {
		console.log(ref.body.artists.items[0].id)
        const dataArr = {
            dataArr: ref.body.artists.items,
        }
    res.render("artist-search-results", dataArr);

	})
	.catch(error => console.log('The error while searching artists occurred:',error))

})

app.get('/albums/:artistId', (req, res, next) => {

  });



    // Our routes go here:
app.listen(3100, () => console.log('My Spotify project running on port 3100 🎧 🥁 🎸 🔊'));
