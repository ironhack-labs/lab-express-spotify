require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next)=>{
    res.render('home')
})

app.get('/artists-search', async(req, res, next)=>{
    const data= req.query.artist //en esta variable se guarda lo que el usuario pone en el buscador
    const datosApiRespuesta= await spotifyApi.searchArtists(data) //aqui se le aplica el metodo de spotify y nos regresa la info de la api
  const extractedInfo= await datosApiRespuesta.body.artists.items.map((elem)=>({ //como lo que hay dentro de items es un array, aplicamos un map para que nos de un nuevo
      name: elem.name,
      image: elem.images[0],
      id: elem.id
  }))
  //console.log(datosApiRespuesta.body.artists.items[0].images[0].url)
  res.render(('artistsearchresults'), {extractedInfo})
    })

app.get('/albums/:id', async(req, res, next)=>{
    const idDelArtistaSeleccionado= req.params.id
    const albums= await spotifyApi.getArtistAlbums(idDelArtistaSeleccionado)
    //console.log("ahora empieza aqui",albumes.body.items[0])
    const albumsInfo= albums.body.items.map((elem)=>({
        image: elem.images[0],
        name: elem.name,
        id: elem.id
    }))  
    res.render(('albums'), {albumsInfo})
})    
     

app.get('/tracks/:id', async(req, res, next)=>{
    const idDelAlbumSeleccionado= req.params.id
    const tracks= await spotifyApi.getAlbumTracks(idDelAlbumSeleccionado)
    //console.log("desdeaqui",tracks.body.items[0])
    const tracksInfo= tracks.body.items.map((elem)=>({
        name: elem.name,
        preview: elem.preview_url
    }))
    res.render(("tracks"), {tracksInfo})

})


 //LEVANTAMIENTO DEL SERVER   

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
