require('dotenv').config();

const express      = require('express');
const hbs          = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/partials')


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId : process.env.clientId,
    clientSecret : process.env.clientSecret
  })
  
  // Retrieve an access token
  spotifyApi.clientCredentialsGrant()
    .then( data => {
      spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error);
    })




// the routes go here:


app.get("/", (req, res, next) => {
    res.render("index")
})

app.get("/artists", (req, res, next) => {
  spotifyApi.searchArtists(req.query.search_query)
    .then (data => {
      const artists = data.body.artists.items
      res.render("artists", {artists})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err)
    })
})


app.get("/albums/:id", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then (data => {
      const albums = data.body.items
      res.render("albums", {albums})
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err)
    })
})

app.get("/albums/:artist/:id", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id)
  .then (data => {
    const tracks = data.body.items
    res.render("playlist", {tracks})
  })
  .catch(err => {
    console.log("The error while searching tracks occurred: ", err)
  })
})

app.listen(4000, () => console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊"));
