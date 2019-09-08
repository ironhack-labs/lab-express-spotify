const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");

const clientId = 'ef514cb3bf274975a7f30ef224bcb1c6',
    clientSecret = '4d40222bf77c4c52966375a26671bf24';

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
})

app.get('/', (req, res) => {
    res.render('home.hbs');
});

app.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.q)
    .then(data => {
      const artists = data.body.artists.items;
      res.render('artists.hbs', { artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })  
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      const albums = data.body.items;
      res.render('albums.hbs', { albums });
    })
    .catch(err => {
      console.log("The error while searching albums occured: ", err);
    });
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      const tracks = data.body.items;
      res.render('tracks.hbs', { tracks });
    })
    .catch(err => {
      console.log("The error while searching album tracks occures: ", err);
    })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));