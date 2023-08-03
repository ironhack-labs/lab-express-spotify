
const spotifyApi = require('../models/spotify');

module.exports.home = (req, res) => {
    res.render('home')
}

module.exports.searchArtist = (req, res) => {
    
    spotifyApi
        .searchArtists(req.query.name)
        .then(data => {
            //console.log('The received data from the API: ', data.body);
            res.render('artists/artist-search-results', { data: data.body })
            //console.log("este es el dataBody:", data.body.artists)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

}    

module.exports.getAlbum = (req, res) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
    .then((data) => {
      //console.log('Artist albums', data.body);
      //console.log("data-body: ",  data.body)
      res.render('artists/albums', {albums: data.body.items})
    },
    function(err) {
      console.error(err);
    }
  );
}

module.exports.searchTracks = (req, res) => {

  spotifyApi.getAlbumTracks(req.params.id)
    .then((data) => {
      
      console.log("data-body-items: ",  data.body.items)
      res.render("artists/tracks", {tracks: data.body.items})
  
    },
    function(err) {
      console.error(err);
    }
  );
}