const router = require("express").Router();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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

router.get("/", (req, res) => res.render("home"));

router.get("/artist-search", (req, res) => {
  // console.log(req.query.artistSearch);
  console.log("ARTISTS PAGE")
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artists = data.body.artists;
      res.render("artist-search-results", { artists })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

router.get('/albums/:artistId', async (req, res) => {
  try {
    const dataFromApi = await spotifyApi.getArtistAlbums(req.params.artistId);
    // console.log("Data from API:", dataFromApi.body);
    console.log("ALBUM PAGE")
    const albums = dataFromApi.body;
    res.render("albums", { albums })
  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
});

router.get('/tracks/:albumId', async (req, res) => {
  console.log("TRACKS PAGE");
  try {
    const dataFromApi = await spotifyApi.getAlbumTracks(req.params.albumId);
    const tracks = dataFromApi.body.items;
    console.log("track data:", tracks);
    res.render('tracks', { tracks })

  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
});

module.exports = router;
