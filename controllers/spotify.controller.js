//import spotify config here to run
const spotifyApi = require("../config/spotify.config");

module.exports.home = (req, res) => {
  res.render("home");
}

module.exports.search = (req, res) => {
  spotifyApi
    .searchArtists(req.query.search)       /*'HERE GOES THE QUERY ARTIST'*/  // GET /artist-search?search=sharika
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("search", { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
};

module.exports.albums = (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
};

module.exports.tracks = (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
};