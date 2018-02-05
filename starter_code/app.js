const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// Remember to paste here your credentials
app.use(express.static("public"));
app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  morgan(
    `Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`
  )
);
const clientId = "c0e409f724564333a240dbd7d5ab5f75";
const clientSecret = "c4919a5eec624e31ba1973b395370c3b";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});


app.set("layout", "layouts/main-layout");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

var buscar =function (data) {
    
}
app.get("/", (req, res, next) => {
  // Retrieve a random chuck joke
  res.render("form");
  
  
});
app.get("/artist", (req, res, next) => {
  // Retrieve a random chuck joke
  res.render("form");
});

app.post("/artist", (req, res, next) => {
  let artistName=req.body.artistName;
  
  spotifyApi.searchArtists("elton").then(function(data) {
      console.log('Search artists by "' + artistName + '"', data.body);


      res.render('resultado', {items:data.body.items,limit:data.body.limit})
      // res.send(data.body);
    }, function(err) {
      console.error(err);
    });
    
  // console.log(algo);
    
});



app.listen(3000, () => {
  console.log("My Spotify API listening on port 3000!");
});
