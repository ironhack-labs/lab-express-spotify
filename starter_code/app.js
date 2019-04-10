const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node")

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const clientId = '292e81d7af4a4d15afed6b919438fa84',
    clientSecret = 'c3dccb4e5842429bad289e7a890d66d7';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.get("/", (req, res) => {
	res.render("index")
})

app.get("/artists", (req, res) => {
	// console.log(req.query.artistName);
	spotifyApi.searchArtists(req.query.artistName)
    .then(data => {
      console.log("The received data from the API: ", data.body);
			res.render("artists")
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
