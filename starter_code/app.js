require('dotenv').config()

// require spotify-web-api-node package here:
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');


// Remember to insert your credentials here
const clientId = process.env.clientId,
    clientSecret = process.env.clientSecret;


console.log(process.env.PORT)

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



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')


// setting the spotify-api goes here:

//artist
app.get("/artists", (req, res, next) => {
  console.log(req.query.artist)
  spotifyApi.searchArtists(req.query.artist)
    .then(artist => {
      console.log("The received data from the API: ", artist.body.artists.items);
      res.render("artists", {artist:artist.body.artists.items})// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

})


//albums
app.get("/albums/:id", (req, res, next) => {
  console.log(req.params.id)
  spotifyApi.getArtistAlbums(req.params.id)
    .then(album => {
      console.log("The received data from the API: ", album.body.items);
      res.render("albums", {album:album.body.items})
      
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })

})


//renderiza la vista del formulario
app.get('/', (req, res, next) => res.render("index"))



app.listen(process.env.PORT, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
