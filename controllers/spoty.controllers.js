const SpotifyWebApi  = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
     clientId: process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET
});
 
 spotifyApi
     .clientCredentialsGrant()
     .then(data => spotifyApi.setAccessToken(data.body.access_token))
     .catch(error => console.log('Something went wrong when retrieving an access token', error));
 

module.exports.home = (req,res,next) => {
    res.render('spoty/home')
}

module.exports.search = (req,res,next) => {
 
     const { search } = req.query;
  
     let artistArr = []

     spotifyApi
        .searchArtists(search)
        .then(data => {

            artistObject = data.body

            artistas = artistObject.artists.items
                for (let artist of artistas){
                    artistArr.push(artist)
                }

            //console.log(artistArr[0])

            const artistImg = artistArr[0].images[0].url;
            
            console.log(artistImg)
            
            res.render('spoty/artist-search-result', { 
                artistArr, 
                artistImg:artistImg})
            }    
        )
        .catch(err => console.log('The error while searching artists occurred: ', err));
}


module.exports.album = (req, res, next) => {

    const { artistId } = req.params;

    let artistAlbumsArr = []

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            
            const albumObjects = data.body.items;

            for (let album of albumObjects){
                artistAlbumsArr.push(album)
            }
            
            const albumId = artistAlbumsArr[0].id

            const artistName = artistAlbumsArr[0].artists[0].name

            res.render(`spoty/albums`, { 
                artistAlbumsArr,
                artistName,
                albumId
             })
        })
        .catch(err => console.error(err))
}
module.exports.tracks = (req,res,next) => {

    const { albumId } = req.params;

    spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 })
        .then(data => {
            const previewTracks = data.body.items
            res.render('spoty/tracks', {
                previewTracks
            })
        })
        .catch(err => console.error(err))

    
}