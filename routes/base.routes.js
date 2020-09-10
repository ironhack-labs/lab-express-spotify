const express = require('express')
const router = express.Router()

const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Endpoints
router.get('/', (req, res) => res.render('index'))

//Búsqueda de artistas
router.get('/artist-search',(req, res) => {
    const artistSearched = req.query.artist

    spotifyApi
        .searchArtists(artistSearched)
        .then(data => {
            res.render('artist-search-results', data.body) 
            //RECOGEMOS LA INFORMACIÓN DE LA API Y LA MANDAMOS A LA VISTA DE RESULTADOS DE BÚSQUEDA 
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

//Búsqueda de discos al hacer click en el botoón ver álbums
router.get('/albums/:id', (req, res) => {
    const artistId = req.params.id

    spotifyApi
        .getArtistAlbums(artistId )
        .then(data => {
            res.render('albums-search-results', data.body) 
    //RECOGEMOS LA INFORMACIÓN DE LA API Y LA MANDAMOS A LA VISTA DE RESULTADOS DE BÚSQUEDA 
  })
        .catch(err => console.log('The error while searching artists occurred: ', err));
} )

router.get('/tracks/:id', (req, res) => {
    const tracksId = req.params.id

    spotifyApi
        .getAlbumTracks(tracksId )
        .then(data => {
            console.log(data.body)
            res.render('tracks-search-results', data.body) 
    //RECOGEMOS LA INFORMACIÓN DE LA API Y LA MANDAMOS A LA VISTA DE RESULTADOS DE BÚSQUEDA 
  })
        .catch(err => console.log('The error while searching artists occurred: ', err));
} )


module.exports = router
