const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

const bodyparser = require("body-parser");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
var clientId = "ea28fc6ff4ec4c6bb3d087da7688d4fd",
  clientSecret = "820ec20836574167866b2574301603f2";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/", (req, res, next) => {
  res.render("index", { title: "Home" });
});

// app.use((req,res,next) => {
//    if(req.body.ta == "marc"){
//        res.send('NO PUEDES PASAR');
//    }else{
//        next();
//    }

// });

// app.get('/artists/:artist', (req, res) => {
//     console.log(req.query);
//     console.log(req.params);
//     console.log(req.color);
//     //const {ta,color} = req.params;
//     const {artist} = req.query;
//     res.render('artist',{
//         artist
//     });
// })

app.post("/artists", (req, res, next) => {
  const artist = req.body.artist;

  spotifyApi.searchArtists(artist)
  .then(data => {
      let artistArr = data.body.artists.items;
      console.log(data.body.artists.items)
      res.render("artist", {data: artistArr});
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {

  const albums = req.params.artistId;

  
  spotifyApi.getArtistAlbums(albums)
  .then(data => {
    let albumArr = data.body.items;
    console.log(data.body.items[0].artists[0]);
    res.render('albums',{data: albumArr});
    })
    .catch(err => {
      console.error(err);
    });
});




const port = 3000;
app.listen(port, () => console.log(`Ready on http://localhost:${port}`));
