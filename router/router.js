const express = require('express');
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );


router.get("/", (req, res) => {
  res.render("index");
});


router.get('/artist-search', (req, res, next) => {
  const queryArtist = req.query.artist;

  spotifyApi
    .searchArtists(queryArtist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      res.render('artist-search', { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


router.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      res.render('albums', { albums: data.body.items });
    })
    .catch(err => console.log('Error fetching artist albums: ', err));
});


router.get('/tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      res.render('tracks', { tracks: data.body.items });
    })
    .catch(err => console.log('Error fetching album tracks: ', err));
});




module.exports = router;