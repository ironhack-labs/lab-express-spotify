const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '2dabc99b37ee44f4be6b79c804af5bf2';
const clientSecret = '04d8f7cc3a6743278f41f9b358d3a0ef';
const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
spotifyApi.clientCredentialsGrant()
.then( data => {
  spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
  console.log('Something went wrong when retrieving an access token', error);
})


module.exports.index = (req, res, next) => {
  res.render('index');
};

module.exports.artist = (req, res, next) => {
  const artist = req.body.artist;
  spotifyApi.searchArtists(artist)
    .then(data => { 
      console.log(data.body.artists)
      res.render('artists', data.body.artists)
      
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
}

module.exports.albums = (req, res, next) => {
  const id = req.params.artistId
  spotifyApi.getArtistAlbums(id)
  .then (album => {
    res.render('albums', album.body)})
  .catch (err => {
    console.error("WTF BRO: ", err)
  })
}

module.exports.tracks = (req, res, next) => {
  const id = req.params.artistId
  spotifyApi.getAlbumTracks(id)
  .then (track => {
    console.log(track.body.items)
    res.render('tracks', track.body)})
  .catch (err => {
    console.error("WHAT THE HECK MAN: : ", err)
  })
}