const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
console.log(process.env.CLIENT_ID);
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

module.exports.artistSearch = (req, res, next) => {
  const { name } = req.query;
  console.log(req.query);
  spotifyApi
    .searchArtists(name) /*'HERE GOES THE QUERY ARTIST'*/
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("artist-search-results", { data: data.body.artists.items });
      //res.send(data.body)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
};

module.exports.getArtistAlbums = (req, res, next) => {
  const id = req.params.artistId;

  spotifyApi.getArtistAlbums(id).then(
    function (data) {
      console.log("Artist albums", data.body);
      res.render("albums", { data: data.body.items });
      //res.send(data.body)
    },
    function (err) {
      console.error(err);
    }
  );
};

module.exports.getAlbumTrack = (req, res, next) => {
  const id = req.params.albumsId;

  spotifyApi.getAlbumTracks(id)
  .then(
    function (data) {
      console.log("Albums tracks", data.body);
      res.render("tracks", { data: data.body.items });
      //res.send(data.body)
    },
    function (err) {
      console.error(err);
    }
  );
};
