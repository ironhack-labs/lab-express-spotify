const express = require('express');
const hbs = require('hbs');

const bodyParser = require('body-parser');

require('dotenv').config();


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


// setting the spotify-api goes here:
const clientId = process.env.API_CLIENT,
    clientSecret = process.env.API_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });


// the routes go here:
app.get("/", (req, res) => {
    res.render("index");
});


app.post("/artists", (req, res) => {
    spotifyApi
    .searchArtists(req.body.name)
    .then(data => {
        let artists = data.body.artists.items;
        console.log("The received data from the API: ", data.body);
    //   res.json(data);
        res.render("artists", {artists});
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        let albums = data.body.items;    
    //   res.json(data);
        res.render("albums", {albums});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
  });

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
        let tracks = data.body.items;    
    //   res.json(data);
        res.render("tracks", {tracks});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
  });


app.listen(process.env.PORT, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
