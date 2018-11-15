const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");


const bodyParser = require('body-parser');
// ...
app.use(bodyParser.urlencoded({ extended: true }));



var SpotifyWebApi = require("spotify-web-api-node");

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"))



// Remember to paste your credentials here
var clientId = "fff9223895274b1c8717756793a84d3f",
  clientSecret = "26f30c27981e461ebe2b39f188654a5d";


  


var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/homepage", (req, res) => {
  res.render("homepage.hbs");
});

app.get('/artist', function (req,res){
  res.send(req.query)
})

app.get("/artists", (req, res) => {
  var artist= req.query.artist

  spotifyApi.searchArtists(artist)
  .then(data => {
    console.log(data.body.artists.items[0].images[0].url)
    let artistsData = data.body.artists.items

    res.render('artists', {artistsKey: artistsData})
    
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {

    // ----> 'HERE WE CAPTURE THE ERROR'
  })
});

app.get('/albums/:artistId', (req, res) => {
  var idArtist= req.params.artistId


  spotifyApi.getArtistAlbums(idArtist)
  .then(data => {
    console.log(data.body.items)
    let albumsData = data.body.items

    res.render('albums', {albumKey: albumsData})
    
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    
    // ----> 'HERE WE CAPTURE THE ERROR'
  })
});




app.listen(3000, () => console.log('Listen port 3000'));