const router = require("express").Router();
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

router.get("/artist-search", (req, res, next) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const { artists } = data.body;
      //   console.log(data.body);
      res.render("spotify/artist-search-results.hbs", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

router.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((albumsData) => {
      const { items } = albumsData.body;

      res.render("spotify/album.hbs", { items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

router.get('/tracks/:id', (req, res, next) => {
  const { id } = req.params;
  console.log("the id is:", id)
  spotifyApi.getAlbumTracks(id)
    .then((trackData) => {
      const {items} = trackData.body;
      res.render("spotify/tracks.hbs", { items });
    }).catch((err) => {
      console.log('Something went wrong!', err);
    });
})

module.exports = router;
