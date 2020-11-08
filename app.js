require('dotenv').config();

const express = require('express'),
  hbs = require('hbs'),
  router = express.Router(),
  SpotifyWebApi = require('spotify-web-api-node'),
  app = express();

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
// router.get("/", () => {
//   render("layout")
// })

app.get("/",(req, res)=>{
  res.render("index")
})

module.exports = app



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
