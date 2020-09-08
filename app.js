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
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artist-search', async (request, response) => {
  try {
    const { artist } = request.query;

    spotifyApi
      .searchArtists(artist)
      .then(data => {
        console.log('The received data from the API: ', data.body.artists.items[0].images);
        // data.body.artists.forEach((artistData) => {
        //   console.log(artistData);
        // });
        const artistsData = data.body.artists.items;
        response.render('artist-search-results.hbs', { artistsData });
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      })
      .catch((err) => console.log('The error while searching artists occurred: ', err));
  } catch (error) {
    console.log(error);
  }
});

app.get('/albums/:artistId', async (request, response) => {
  try {
    const { artistId } = request.params;

    spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
        console.log('The received data from the API: ', data.body.items[0].artists);

        const artistsAlbums = data.body.items;
        response.render('albums', { artistsAlbums });
      })
      .catch((err) => console.log('The error while searching albums occurred: ', err));
  } catch (error) {
    console.log(error);
  }
});

app.get('/tracks/:albumId', async (request, response) => {
  try {
    const { albumId } = request.params;

    spotifyApi
      .getAlbumTracks(albumId)
      .then(data => {
        console.log('The received data from the API: ', data.body);

        const albumTracks = data.body.items;
        response.render('tracks', { albumTracks });
      })
      .catch((err) => console.log('The error while searching albums occurred: ', err));
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
