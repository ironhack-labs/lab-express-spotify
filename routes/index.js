const router = require("express").Router();
const { spotifyApi, configSpotify } = require("../config/spotify-config");

configSpotify()
  .then((data) => {
    console.log("Spotify API authenticated", data);
  })
  .catch((err) => console.error(err));

// // require spotify-web-api-node package here:
// const SpotifyWebApi = require('spotify-web-api-node');

// // setting the spotify-api goes here:
// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET
// });

// // Retrieve an access token
// spotifyApi
//   .clientCredentialsGrant()
//   .then(data => spotifyApi.setAccessToken(data.body['access_token']))
//   .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

router.get("/", (req, res) => res.render("home"));

router.get("/artist-search", (req, res) => {
  // console.log(req.query.artistSearch);
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((data) => {
      // console.log('The received data from the API: ', data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artists: data.body.artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

router.get("/albums/:artistId", async (req, res) => {
  try {
    const dataFromApi = await spotifyApi.getArtistAlbums(req.params.artistId);
    // console.log("Data from API:", dataFromApi.body);
    res.render("albums", { albums: dataFromApi.body });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

router.get("/tracks/:albumId", async (req, res) => {
  try {
    const dataFromApi = await spotifyApi.getAlbumTracks(req.params.albumId);
    // console.log("track data:", tracks);
    res.render("tracks", {
      tracks: dataFromApi.body.items.sort(
        (a, b) => a.track_number - b.track_number
      ),
    });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

module.exports = router;
