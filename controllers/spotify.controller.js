const SpotifyWebApi = require("spotify-web-api-node");
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );

module.exports.home = (req, res) => {
  res.render("home", {});
};

module.exports.artists = (req, res) => {
  const artistName = req.query.artistName;
  spotifyApi
  .searchArtists(artistName)
  .then(data => {
    const artists = data.body.artists.items;
    res.render('artist-search-results.hbs', { artists });
  })
  .catch(err => console.log('The error while searching artists: ', err));
};

module.exports.albums = (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      res.render("albums", { albums: data.body.items, artist: data.body.items[0].artists[0].name });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
};

module.exports.tracks = (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
};