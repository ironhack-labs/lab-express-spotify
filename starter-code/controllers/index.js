
const spotifyApi = require('../config/spotify.config')

exports.traerArtista =async (req, res) =>{
  // console.log(req.body.artist)
   await spotifyApi
  .searchArtists(req.body.artist)
  .then(data => {
      const artistas =data.body.artists.items
   // console.log('The received data from the API: ', artistas);
    res.render('artist-search-results', {artistas});
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}

//const {artistID}=req.params;

exports.traerAlbums= (req, res) =>{
    const {artistId}=req.params;
 //   console.log(artistId) 
    spotifyApi
    .getArtistAlbums(artistId)
    .then(albums =>{
        const albumes = albums.body.items
     //   console.log(albums)
    res.render('albums', {albumes})
        
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
}

exports.traerTracks= (req, res) =>{
    const {albumId}=req.params;
    console.log(albumId) 
    spotifyApi
    .getAlbumTracks(albumId)
    .then(tracks =>{
        const canciones = tracks.body.items
        console.log(canciones)
    res.render('tracks', {canciones})
        
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
}
