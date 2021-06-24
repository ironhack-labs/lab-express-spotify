const router = require("express").Router()
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


router.get("/", (req, res, next) => res.render("index"))

// Search form: render
router.get('/artistas', (req, res) => {
    console.log(req.query)
    //req.query--->{fname: beatles}

    spotifyApi
        .searchArtists(req.query)
        .then(data => {
            console.log('Los datos recibidos de la API:', data.body);
            // ----> 'AQUÍ LO QUE QUEREMOS HACER DESPUÉS DE RECIBIR LOS DATOS DE LA API' 
        })
        .catch(err => console.log('Se produjo el error al buscar artistas:', err));

    // res.render("artist-search")
})

router.get('/artistas/detalles', (req, res) => res.render("artist-search-results"))


module.exports = router