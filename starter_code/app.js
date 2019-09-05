const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(`${__dirname}/views/partials`)


// setting the spotify-api
const clientId = 'fac89a39610a48b78a0cd80610dea85a',
  clientSecret = 'f5955690aa2b4526b32b700240418cf6';

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
    console.log('Something went wrong when retrieving the access token', error);
  })

// the routes go here:
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artists', (req, res) => {
  const artist = req.query.search
  spotifyApi.searchArtists(artist)
    .then(artists => {
      //console.log("The received data from the API: ", artists.body)
      const artistitems = artists.body.artists.items
      res.render('artists', { artistitems: artistitems })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:artistId', (req, res) => {
  const album = req.params.artistId
  spotifyApi.getArtistAlbums(album)
    .then(albums => {
      //console.log("The received data from the API: ", albums.body)
      const albumsitems = albums.body.items
      res.render('albums', { albumsitems: albumsitems })
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});

app.get('/tracks/:albumId', (req, res) => {
  const album = req.params.albumId
  spotifyApi.getAlbumTracks(album)
    .then(tracks => {
      //console.log("The received data from the API: ", tracks.body)
      const trackitems = tracks.body.items
      res.render('tracks', { trackitems: trackitems })
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
