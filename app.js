require('dotenv').config();
const { application } = require('express');
const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({extended: false}))

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
app.get("/", (req, res)=>{
    res.render("index");
})
app.get("/artist-search", async (req, res) => {
    try{
        console.log("req.query", req.query);
        const artist = req.query.artistName;
        const foundArtist = await spotifyApi.searchArtists(artist);
        //console.log(foundArtist.body.artists.items);
        await res.render("artist-search-results", {ArtistList : foundArtist.body.artists.items});
        /*return foundArtist = spotifyApi
        .searchArtists(({$title: artist, $options: "i"}))
        .then((foundArtists) => {
              console.log(`foundBooks`, foundArtists);
              res.render("artist-search-results", { ArtistList: foundArtists });
            });
            */

        }catch(err){
            console.log(err)
        }
        });

        app.get('/albums/:artistId', async (req, res) => {
            try{
          //  console.log("req.params",req.params)
         const artistId = req.params.artistId;
         const data = await spotifyApi.getArtistAlbums(artistId)
         //console.log(data)
         const albums = data.body.items;
         //console.log("ALBUMS2222",albums)
         await res.render("albums", {albumsList: albums});
         const tracksData = await spotifyApi.getAlbumTracks(artistId, {limit: 5})
         console.log(tracksData);
        }
         catch(err){
             console.log(err)
         }
        })

        app.get("/tracks/:tracksID", async (req,res)=>{
            try{
            const tracksData = await spotifyApi.getAlbumTracks(req.params.tracksID);
            await res.render("tracks" , { tracks: tracksData.body.items });


            }catch(err){
                console.log(err)
            }
        })
        

           
        


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
