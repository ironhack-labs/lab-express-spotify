require('dotenv').config();

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

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Our routes go here:
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/artist-search", (req, res) => {
    //console.log(req.query);
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            const artistsArray = data.body.artists.items;
            res.render("artist-search-results", { artists: artistsArray });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})
app.get('/albums/:artistId', (req, res, next) => {
    //console.log(req.params.artistId);
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(response => {
      // console.log(response.body.items);
    res.render("albums", {albums: response.body.items});
    })
    .catch(err => {});
})
app.get("/tracks/:albumId", (req, res, next) => {
    // req.params.albumId
  
    spotifyApi
      .getAlbumTracks(req.params.albumId)
      .then(response => {
        //  console.log('TRACKS', response.body.items);
  
        const data = {
          tracks: response.body.items
        };
  
        res.render("tracks", data);
      })
      .catch(err => console.log(err));
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
