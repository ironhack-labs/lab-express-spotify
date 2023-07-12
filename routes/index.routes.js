const express = require('express')
const router = express.Router()

// Need to call the spotifyApi that was only declared in the app.js file and is not accessible here
// Therefore module.exports goes on top, passing spotifyApi as an argument
module.exports = (spotifyApi) => {

    router.get("/", (req, res, next) => {
        res.render("home")
    })

    router.get("/artist-search", (req, res, next) => {

        const { artist } = req.query

        spotifyApi
            .searchArtists(artist)
            .then(data => {
                //console.log('--->>> YAYYYY The received data from the API: ', JSON.stringify(data.body, null, 2));               
                res.render("artist-search-results", { artistData: data.body })
            })
            .catch(err => console.log('The error while searching artists occurred: ', err));
    })

    router.get('/albums/:artistId', (req, res, next) => {

        const { artistId } = req.params

        spotifyApi
            .getArtistAlbums(artistId)
            .then(data => {
                //console.log('--->>> YAYYYY ARTIST ALBUMS: ', JSON.stringify(data.body, null, 2))
                res.render("albums", { albumData: data.body })
            })
            .catch(err => console.log('Error while searching ALBUMS occurred: ', err))
    })

    router.get('/tracks/:albumId', (req, res, next) => {
        const { albumId } = req.params

        spotifyApi.getAlbumTracks(albumId)
            .then(data => {
                //console.log(--->>> YAYYYY data.body)
                res.render('tracks', { trackData: data.body })
            })
            .catch(err => console.log('Error while searching TRACKS occurred:', err));
    })

    return router
}

// module.exports = router