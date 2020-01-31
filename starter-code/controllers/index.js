
let spotify = require('../config/spotify.config')

exports.searchArtist = async (req,res)=>{
        
   const artist =  spotify
    .searchArtists(req.body.artists)
    .then(data => {
      //console.log('The received data from the API: ', data.body);
    let {items} = data.body.artists
    console.log({items});
    
      res.render('artist-search', { items } )

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

    

}

exports.getAlbums=async (req, res)=>{
    const {artistID}=req.params
//console.log({artistID});
    const albums=await spotify.getArtistAlbums(artistID)

    const albumsFinal=albums.body.items
    res.render('albums', {albumsFinal})
}

exports.getTracks=async (req, res)=>{
    const {tracksID}=req.params

    const tracks=await spotify.getAlbumTracks(tracksID)
  
    const track=tracks.body.items
    
    res.render('tracks', {track})
}