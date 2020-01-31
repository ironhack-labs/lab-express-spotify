const spotifyApi = require("../config/spotify.config")

exports.findArtist =  (req, res) =>{
    const {search} = req.body
    spotifyApi.searchArtists(search)
    .then(data => {
        console.log('the recived data from the api:', data.body)
        res.render('artist-search-results', {data})
    })
    .catch(err => {
        console.log(err, "artist broke")
    })
}

exports.findAlbums = (req, res) => {
    const {artistId} = req.params;
    spotifyApi.getArtistAlbums(artistId)
    .then(album => {
        console.log("got the albums:", album)
        let {items: albumChido} = album.body
        res.render("albums",{albumChido})
    })
    .catch(err => console.log("Albums broke", err))
}

    exports.findTracks = (req, res) => {
        const {albumId} = req.params
      spotifyApi.getAlbumTracks(albumId)
      .then(tracks => {
        console.log("Got the tracks:", tracks)
        let {items: tracksChidas} = tracks.body
        res.render('tracks', {tracksChidas})
    })
    .catch(err => console.log('Tracks broke', err));
    } 