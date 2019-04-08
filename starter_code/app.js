const express = require('express');
const hbs = require('hbs');
const app = express();


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '19e472cd6cfc429c9c0f36dafc865df4',
    clientSecret = 'b2a14cc767b94366900515ee45e22f63';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
  });

app.get('/artists', (req, res, next) => {
    //con req.query (me traigo info a consola)
    console.log(req.query)
    //solicito info del "name"(.artist porq es el valor q hemos puesto en name en el index.hbs) q haya puesto en el input
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
        //artist.items porque al mirar por consola, era un array. ej de images[1] por comprobar que se imprimía.
        console.log("The received data from the API: ", data.body.artists.items[0].images[1]);
        //data.body.artists.items necesito los datos de los artist, pero por regla si no "igualo" con : a algo, no me lee esa cadena.
        res.render('artists', { artists : data.body.artists.items })
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
    console.log('p');
    console.log(req.params)
    const artistId = req.params.artistId;
    console.log(artistId) //
    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
        // console.log("The received data from the API: ", data.body);
        res.render('albums', { albums : data.body.items })
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })
    }); 


// app.get('/tracks/:tracksId', (req, res, next) => {
//     spotifyApi.getArtistAlbums()
//     .then(data => {
//         console.log("The received data from the API: ", data.body);
//         res.render('track', { tracks })
//     })
//     .catch(err => {
//         console.log("The error while searching artists occurred: ", err);
//     })
//     }); 


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
