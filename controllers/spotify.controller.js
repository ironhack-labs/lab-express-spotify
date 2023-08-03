const SpotifyWebApi = require("spotify-web-api-node");

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
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("spotify/artist-search-results", {
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
};

module.exports.albums = (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      const httpHeader = res.req.rawHeaders.find((header) =>
        header.startsWith("http")
      );
      res.render("spotify/albums", {
        albums: data.body.items,
        artist: data.body.items[0].artists[0].name,
        httpHeader: httpHeader,
      });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
};

module.exports.tracks = (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data) => {
      res.render("spotify/tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
};
