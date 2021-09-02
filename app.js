require('dotenv/config');

const { query } = require('express');
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

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index")
})

app.get("/artist-search", (req, res) => {

  const artistName = req.query.artistName
  console.log("esta es la variable", artistName, "este es el objeto ", req.query)

//  res.send("mira la terminal")
  //res.render("artists")
  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      const arrArtists = data.body.artists
      res.render('artist-search-results', {arrArtists})
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albumsArtist/:artist_id", (req,res)=> {

  const {artist_id} = req.params
  console.log("esto es el id", artist_id)

  spotifyApi
  .getArtistAlbums(artist_id)
  .then(data => {
    console.log("esto es lo que recibimos al buscar por id ",data)

  })
  .catch(err => console.log('The error while searching albums occurred: ', err));


})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
