require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi=require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

const spotifyApi = new SpotifyWebApi({
    clientId: 
    clientSecret: 
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    app.get('/',(req, res, next)=>{
        res.render('index');
    })

    app.get("/artist-search", (req, res, next)=>{
        spotifyApi.searchArtists(req.query.artist)
        .then(data=>{
            let artistsFromApi = data.body.artists.items;            
            res.render("artist-search-results",{artistsFromApi})
           
        })
        .catch(error => console.log(error));  

    })

    app.get("/albums/:id", (req, res, next)=>{
        spotifyApi.getArtistAlbums(req.params.id)
        .then(data=>{
            let albumsFromApi = data.body.items;            
            res.render("albums",{albumsFromApi})
        })
        .catch(error => console.log(error));  

    })

    app.get("/tracks/:id", (req, res, next)=>{
        spotifyApi.getAlbumTracks(req.params.id)
        .then(data=> {
            let tracksFromApi = data.body.items;
            console.log(tracksFromApi)
            res.render("tracks", {tracksFromApi});
        })
        .catch(error => console.log(error));  
    })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
