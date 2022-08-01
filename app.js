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

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/artist-search', (req, res, next) => {
    res.send(req.query);
})


app.get('/artist-search-results', (req, res, next) => {
/*     res.send(req.query); */
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    const artistResult = data.body.artists.items;
    res.render("artistSearchResults", { artistResult });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req, res, next) => {
    const { artistId } = req.params;
    spotifyApi
      .getArtistAlbums(artistId)
      .then((album) => {
        console.log("Albums access with success");
  
        const albumResult = album.body.items;
  
        res.render("albums", { albumResult });
        console.log(albumResult);
      })
      .catch((err) =>
        console.log("Wait for it!", err)
      );
  });
  
  app.get("/tracks/:trackId", (req, res, next) => {
    const { trackId } = req.params;
    spotifyApi
      .getAlbumTracks(trackId)
      .then((tracks) => {
        console.log("its working");
  
        const tracksResult = tracks.body.items;
        res.render("viewTracks", { tracksResult } );
        console.log(tracksResult);
      })
      .catch((err) =>
        console.log("Just wait for it", err)
      );
  });
  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
