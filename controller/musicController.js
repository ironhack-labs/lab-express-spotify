const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    // console.log(data);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

exports.home = (req, res) => {
  res.render("index");
};

// req.query.artist es el resultado de la busqueda del form, req.query obtiene el contenido de busqueda con nombre name="artist" del hbs donde se encuentra el form
exports.search = (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // console.log(data.body.artists.items[0].id);
      res.render("artist-search-results", {
        listArtist: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  // console.log(req.query.artist);
  // res.render("artist-search-result");
};

exports.album = (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // console.log(data.body.items);
      res.render("albums", {
        listAlbum: data.body.items,
      });
    })
    .catch((error) => console.log(`No se pudo obtener el album: ${error}`));
};

exports.songs = (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.artistId)
    .then((data) => {
      console.log(data.body.items[0]);

      res.render("tracks", {
        listTracks: data.body.items,
      });
    })
    .catch((error) => console.log(`No se pudo obtener los tracks: ${error}`));
};
