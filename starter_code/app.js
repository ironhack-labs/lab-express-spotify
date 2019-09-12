require('dotenv').config()

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

console.log(spotifyApi)

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });





// the routes go here:

app.get('/',(req,res)=>{
res.render("index")
})

app.get('/artists',(req,res)=>{
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            
            // console.log("The received data from the API: ", data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            let results = data.body.artists.items;
            // console.log(results)
            // console.log(results[0].images)
            res.render("artists",{results})
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
    
})

app.get('/albums/:id',(req,res)=>{
    // console.log(req.params.id)
        spotifyApi.getArtistAlbums(req.params.id).then((data)=>{
            
            let albums = data.body.items
            res.render("albums",{albums})
        })
        .catch(err => {
            console.log("Albums: ", err);
            })
       
    
})

app.get('/tracks/:id',(req,res)=>{
    spotifyApi.getAlbumTracks(req.params.id).then((data) => {

        let tracks = data.body.items
        console.log(tracks)
        res.render("tracks", { tracks })
    })
        .catch(err => {
            console.log("Tracks: ", err);
        })

})








app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
