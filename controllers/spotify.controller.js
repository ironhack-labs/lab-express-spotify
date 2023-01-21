const spotifyApi = require("../config/spotify.config");

module.exports.home = (req, res) => {
  res.render("pages/home");
};

module.exports.result = (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("pages/artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
};

module.exports.albums = (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      // console.log(data.body.items)
      res.render("pages/albums", { albums: data.body.items });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
};
