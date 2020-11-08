require('dotenv').config();

const express = require('express'),
  hbs = require('hbs'),
  router = express.Router(),
  SpotifyWebApi = require('spotify-web-api-node'),
  chalkAnimation = require('chalk-animation'),
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

app.get("/", (req, res) => {

  res.render("index")
})

app.get("/artistSearch", (req, res, next) => {
  const artist = req.query
  console.log(req.query.artistSearch);
  spotifyApi.searchArtists(req.query.artistSearch)
  .then(function(data) {
    // console.log('Search artists by "Love"', data.body);
    const artists = data.body;
    res.render("artistSearch", { artists });
  }, function(err) {
    console.error(err);
  });
})

module.exports = app



app.listen(3000, () => chalkAnimation.rainbow('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
