const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

const port = 3000;

const clientID = "60e8957408274d35ac3e9e4739ff17c7";
const clientSecret = "068e7f2e990e40238abfb3ff74b31ed2";

const spotifyApi = new SpotifyWebApi({
  clientId: clientID,
  clientSecret: clientSecret
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res, next) => {
  res.render('index');
})

app.get('/artists', (req,res,next) => {

  let artistName = req.query.artist;
  spotifyApi.searchArtists(artistName)
    .then(artists => {
      
      const data = {
        name: artistName,
        artist: artists.body.artists.items
      }
      res.render('artists', data);
    })
    .catch(err => {
      console.log(`Error: ${err}`)
    })
})

app.get('/albums', (req, res, next) => {

  let artistID = req.query.artistID;
  let artistName = req.query.name;

  console.log(artistID)
  
  
  spotifyApi.getArtistAlbums(artistID)
    .then(albums => {
      console.log(albums.body.items)
      /* console.log(artistName) */
      const data = {
        name: artistName,
        albums: albums.body.items
      }
      res.render('albums', data);
    })
    .catch(err => {
      console.log(`Error: ${err}`)
    })

})

app.get('/tracks', (req, res, next) => {

  let albumID = req.query.albumID;
  let albumName = req.query.albumName;

  console.log(albumID)
  console.log(albumName)


  spotifyApi.getAlbumTracks(albumID)
    .then(tracks => {
      console.log(tracks.body.items)
      
      const data = {
        name: albumName,
        tracks: tracks.body.items
      }
      res.render('tracks', data);
    })
    .catch(err => {
      console.log(`Error: ${err}`)
    })
})

app.listen(port, () => console.log(`Server listening @ localhost:${port}`));


