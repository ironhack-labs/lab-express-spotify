const spotifyApi=require("../config/spotify.config")

exports.getArtist = async (req,res)=>{
    let artista= await spotifyApi
  .searchArtists(//'HERE GOES THE QUERY ARTIST'
  req.body.artist
    )
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    const artistArr = data.body.artists.items
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    //res.send(data)
    res.render('artist-search-result',{artistArr})
})
  .catch(err => console.log('The error while searching artists occurred: ', err));
}


exports.getAlbums=async (req,res)=>{
    const {albumId}=req.params
    const albums= await spotifyApi.getArtistAlbums(albumId)
    const albumsFinal=albums.body.items
    //res.send(albums)
    res.render('albums',{albumsFinal})
}

exports.getTracks=async (req,res)=>{
    const {tracksId}=req.params
    const tracks= await spotifyApi.getAlbumTracks(tracksId)
    const tracksFinal=tracks.body.items
    //res.send(albums)
    res.render('tracks',{tracksFinal})
}