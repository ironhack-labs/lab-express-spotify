require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({ extended: true }));


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

// the routes go here:

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/albums/:id", (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data=>{
        let albumArr = data.body.items.map(album=>{
        
            let newAlbum ={
                id: album.id,
                imageUrl: album.images[0] ? album.images[0].url : `https://cdn3.iconfinder.com/data/icons/music-and-audio-1/26/music-audio-1027-512.png`,
                name: album.name,
                album: true
            }
            return newAlbum;
      });
      res.render("albums", { albumArr });
    })
    .catch(err => {
        console.log("The error while searching albums occurred: ", err);
      });
    
});

app.post("/artists", (req, res) => {

    spotifyApi
    .searchArtists(req.body.name)
    .then(data => {
        //console.log(data.body.artists.items[0].images[0].url);
      //console.log("The received data from the API: ", data.body.artists.items);
      let artistArr = data.body.artists.items.map(artist=>{
        
            let newArtist ={
                id: artist.id,
                imageUrl: artist.images[0] ? artist.images[0].url : `https://cdn3.iconfinder.com/data/icons/music-and-audio-1/26/music-audio-1027-512.png`,
                name: artist.name,
                artist: true
            }
            return newArtist;
      });
     res.render("artists", { artistArr });
      
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });

  });



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));