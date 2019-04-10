const express = require('./node_modules/express');
const hbs = require('./node_modules/hbs/lib/hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('./node_modules/spotify-web-api-node/src/server');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '9d95380e468b4001a15050c906d3d90d',
  clientSecret = '566268d5a8ff433ea54f27df7f4fb44e';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:
app.get("/", (req, res) => {
  res.render("home.hbs");
});

app.get("/artists", (req, res) => {
  // return console.log("here", req.query)
  spotifyApi.searchArtists(req.query.artistname)
    .then(data => {
      // res.json(data)
      // console.log("The received data from the API: ", data.body);
      res.render("artists.hbs", {
        data
      });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(albums => {
      // res.json(albums)
      res.render("albums.hbs", {
        albums
      });
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
  // console.log("hey", req.params)
  // spotifyApi.getArtistAlbums()
});





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));