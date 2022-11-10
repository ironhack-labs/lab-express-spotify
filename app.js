require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
  res.render("index")
})
app.get('/artist-search', (req, res) => {
  const { artist } = req.query


  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const groups = data.body.artists.items
      // console.log("dfghjklkjhbvioijhjkijhghijhghjijhjijhg", groups[0].images[0])

      res.render("artist-search", { groups })  //{groups:groups}
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums', (req, res) => {
  res.render("albums")
})
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums()
    .then(data => {
      const groups = data.body.artists.items
      console.log("dfghjklkjhbvioijhjkijhghijhghjijhjijhg", groups[0].images[0])

      res.render("artist-search", { groups })  //{groups:groups}
        .catch(err => console.log('The error while searching artists occurred: ', err));
    });
})

// spotifyApi.get('/artist-search/:name', (req, res) => {
//   const { name } = req.body
//   console.log(name)
// })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
