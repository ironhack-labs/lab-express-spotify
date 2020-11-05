app.get('/albums/:artistId', (req, res, next) => {
//     spotifyApi.getArtistAlbums((req.params).artistID)
//         .then(data => {
//             console.log('The received data from the API: ', data.body),
//                 res.render(`albums`, {
//                     data
//                 })
//         })
// })