const express = require ('express');
const app = express();
const hbs = require ('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');



app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static('public'));
app.set("layout", __dirname + "/views/layout.hbs");
app.use(bodyParser.urlencoded({ extended : false }));
hbs.registerPartials(__dirname + "/views/partials")


const clientId = 'b377b2bfd2cb4934b29dd9cd8520fa99',
    clientSecret = '46a54bfc5a56418fb1320636030279e3';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then((data)=> {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err)=> {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get("/", (req, res)=>{

  res.render("home")

});

app.get("/search", (req, res, next)=>{
  let artistSearch = req.query.artist;
  spotifyApi.searchArtists(artistSearch)
  .then( data => {
    let artistItems =  data.body.artists.items;
    res.render("artists",{ artist:artistItems});
    })
 .catch( err => {
    console.error(err);
  });
});

app.get("/albums/:artistId", (req, res)=> {
  let artParam = req.params.artistId;
  spotifyApi.getArtistAlbums(artParam)
  .then(data=>{
    let albumsItems = data.body.items;
    res.render("albums",{album: albumsItems});
  })
  .catch(err =>{
    console.log(err);
  })
})

app.get("/tracks/:albumId", (req, res) =>{
  let albParam = req.params.albumId;
  spotifyApi.getAlbumTracks(albParam)
  .then(data => {
    let trackItems = data.body.items;
    res.render("tracks", {track: trackItems});
  })
  .catch(err=>{
    console.log(err);
  })
})


app.listen(3000, err => console.log("Jalando en el 3000"));

