require('dotenv').config();

const express = require('express');
const hbs = require('hbs');






const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });


  // setting the spotify-api goes here:
spotifyApi
.clientCredentialsGrant()
.then(data => {
spotifyApi.setAccessToken(data.body['access_token'])
})
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// require spotify-web-api-node package here:
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');



app.get("/", (req, res, next) => {
    
    res.render("artist-search");
})


app.get("/artist-search", (req, res, next) => {
    
    spotifyApi.searchArtists(req.query.artists)
	.then((ref) => {
		console.log(ref.body.artists.items[0].id)
        const dataArr = {
            dataArr: ref.body.artists.items,
        }
    res.render("artist-search-results", dataArr);

	})
	.catch(error => console.log('The error while searching artists occurred:',error))

})

app.get('/albums/:artistId', (req, res, next) => {
    //console.log(req.params);
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then((albumId) => {
        //console.log(albumId.body.items);
            const albumArr ={
                albumArr: albumId.body.items
            }
        res.render("album", albumArr)
    })
    .catch(e => console.log("Error for searching album of artist by ID"));
  });

app.get('/albums/tracks/:albumId', (req, res, next) =>{
    
    console.log(req.params);

    spotifyApi.getAlbumTracks(req.params.albumId)
    .then((tracksInfo) => {
        //console.log(tracksInfo.body.items[0].href)
        const tracksArr = {
            tracksArr: tracksInfo.body.items
        }
        res.render('trackInfo', tracksArr)
    })
    .catch(e => console.log('Error for searching Track ID', e));
  })


    // Our routes go here:
app.listen(3100, () => console.log('My Spotify project running on port 3100 🎧 🥁 🎸 🔊'));
