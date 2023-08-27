require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//spotify-api here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

//access token here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Route goes here --> Home Page
app.get("/", (req, res, next) => {
  res.render("homepage");
});

app.get("/artist-search", (req, res, next) => {
  let artistName = req.query.name;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      // console.log("The received data from the API: ", data.body.artists);

      const artistsData = data.body.artists.items.map((artist) => {
        // console.log("element.name", element.name);
        return {
          name: artist.name,
          image: artist.images[1],
          id: artist.id,
        };
      });

      res.render("artist-search-results", {
        artistsData,
        artistName,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});


// route artistID -> albums
app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      let albums = data.body.items
        .map((album) => {
          return {
            name: album.name,
            image: album.images[1],
            id: album.id,
          };
        })
      res.render('albums', { albums });
    })
    .catch(err => console.log('The error while retrieving artist albums occurred: ', err));
});

// route albumsID --> tracks
app.get('/tracks/:albumId', (req, res, next) => {
  let albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      const tracksView = data.body.items.map((track) => {
        return {
          name: track.name,
          preview_url: track.preview_url
        }
      })
      res.render('tracks', { tracksView })
    })
    .catch(err => {
      console.log(err)
      res.render('error', {
        message: 'Sorry, an error happened. Check your URL'
      })
    })
})

app.listen(3001, () =>
  console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
