require('dotenv').config()
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:



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
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });




// the routes go here:

app.get("/", (req, res)=>{
    res.render("index")
})

app.get("/artists", (req, res)=>{   
    // console.log(req.query);
     
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            // console.log("The received data from the API: ", data.body.artists.items);
            res.render("artists", {artists: data.body.artists.items})
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
    
})

app.get("/albums/:artist", (req, res)=>{
    console.log("in :artist")
    console.log("Passing to albums: ", req.params)

    spotifyApi
        .searchArtists(req.params.artist)
        .then(data => {
            var albumsObj;
            data.body.artists.items.forEach((a, index)=>{                
                if(data.body.artists.items[index].name == req.params.artist){

                        spotifyApi.getArtistAlbums(data.body.artists.items[index].id)
                            .then(function(data) {
                                albumsObj={albums: data.body.items}
                                // console.log(albumsObj)
                                // res.render("albums", {albums: data.body.items})
                                // return data.albums.map(function(a) { return a.id; });
                            })
                            .then(()=>{
                                res.render("albums", albumsObj)
                            })
                            .catch(err=>{
                                console.log("aaaaaaaaaaaaerrroooon" , err);
                                
                            })
                }
            })
            
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });

})

app.get("/album/:album", (req, res)=>{
    console.log("got to album");
    
    spotifyApi.getAlbum(req.params.album)

    
    .then(function(data) {    
        console.log(data.body.tracks.items);
        
        res.render("tracks", {tracks: data.body.tracks.items})
    //   return data.tracks.map(function(t) { return t.id; });
    })
    // .then(function(trackIds) {
    //   return spotifyApi.getTracks(trackIds);
    // })
    // .then(function(tracksInfo) {
    //   console.log(tracksInfo);
    // })
    // .catch(function(error) {
    //   console.error(error);
    // });

})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
