const spotifyApi = require("../config/spotify.config");

module.exports.home = (req, res) => {
  res.render("pages/home");
};

module.exports.result = (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // console.log(data.body.artists.items[2].images[1].url);
      res.render("pages/artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
};
