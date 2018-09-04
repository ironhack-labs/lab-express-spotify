var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const app = express();
const hbs = require('hbs')
const path =require('path');

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, 'public')));


// Remember to paste here your credentials
var clientId = '485e364a0f6b42d199a2341709fe3906',
    clientSecret = 'c7cadf1b3d30485594590a3fae9a4e81';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// Express Route - defines a page of content on your website
app.get("/", (request, response, next) => {
    response.render("home-page.hbs");
    // __dirname = "DIRECTORY NAME"
});

app.get("/artists", (req, res, next) => {

// choper le string de recherche
// demander à l'api de chercher
// checker la data
// faire ma variable

    const { artist } = req.query;
    spotifyApi.searchArtists(artist)
    .then(data => {
        // res.json( data.body.artists.items );
        res.locals.artistArray = data.body.artists.items;
        res.render("search-results.hbs")
    })
    .catch(err => {
        console.log("error", err)
    })
});


app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params;

    spotifyApi.getArtistAlbums(artistId)
    .then(spotifyDoc => {
      // send the database result (1) to the template as "bookItem"
      res.locals.spotifyItem = spotifyDoc.body.items;
      res.render("album-page.hbs");
    })
    .catch(err => next(err));
  });



app.listen(3000, () => {
    console.log("We are ready to go! 🤼‍♀️");
});

