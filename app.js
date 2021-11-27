require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static('public')); //No es necesario que le pongamos __dirname (app.use(express.static(__dirname + '/public')))

//configuración partials
hbs.registerPartials(__dirname + '/views/partials')


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
});


spotifyApi
.clientCredentialsGrant()
.then(data=>spotifyApi.setAccessToken(data.body['access_token']))
.catch(err=>console.log("Algo salió mal cuando pedimos el Token"))

// Our routes go here:

app.get("/",(req,resp,next)=>{
    resp.render('home')
})

app.get('/artist-search',(req,res,next)=>{
    console.log(req.query)
    //https://facebook.com/perros?name=Perro&Age=8&size=Small.
    //Regresa en un objeto:
    /* 
    name: "Perro";
    age: "8";
    size: "Small"
    */ 
    const {search} = req.query
    spotifyApi
    .searchArtists(search)
    .then(data => {
        console.log("Data",data.body.artists.items)
        res.render('resultsArtist',{albums: data.body.artists.items})
    })
    .catch(err=>{
        console.log(err)
    })
})

app.get('/albums/:artistId',(req,res,next)=>{
    //https://google.com/albums/13241590jadsf
    /* Se crea un objeto:
    {
        artistId: "13241590jadsf"
    }
    */
    const {artistId} = req.params
    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
        console.log("la data",data)
        res.render("albumsList",{albums: data.body.items})
    })
    .catch(error=>{
        console.log("error",error)
        res.send("error")
    })
})

app.get('/tracks/:albumId',(req,res,next)=>{
    const {albumId} = req.params
    spotifyApi.getAlbumTracks(albumId)
    .then(data => {
        console.log("los tracks",data.body.items)
        res.render("tracks",{tracks:data.body.items})
    })
    .catch(error=>{
        console.log("error",error)
        res.send("error")
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
