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
  
console.log(spotifyApi);
  // Retrieve an access token
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/artist-search', (req, res) => {

    console.log(req.query.search)
    spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // res.render("artist-search-results")
    let artists = data.body.artists.items
    res.render("artist-search-results", {artists})
    // res.send({artists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  //get artist albums
  app.get("/albums/:artistId", (req,res, next) => {
    const {artistId:artistId} = req.params;
    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
        res.render("albums", {albums:data.body.items})
    })
    .catch(err => console.log("error occurred: ", err)
    );
});


  app.get("/albums/tracks/:albumId", (req,res, next) => {
    const {albumId:albumId} = req.params;
    spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      //console.log('Artist albums', data.body);
      res.render("tracks", {tracks:data.body.items})
  })
    .catch(err => console.log("error occurred", err)
  );
})

//     spotifyApi
//     .getArtistAlbums()
//   .then(function(data) {
//     console.log('Artist albums', data.body);
//     let artistAlbums= data.body.artists.
//   }, function(err) {
//     console.error(err);
//});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
