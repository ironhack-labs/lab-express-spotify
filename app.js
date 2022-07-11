require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  let searchQuery = req.query.search;
  console.log(searchQuery);
  spotifyApi
    .searchArtists(searchQuery)
    .then((result) => {
      console.log("We've received your request!");
      const info = result.body.artists.items;
      //   console.log(info);
      return res.render("artist-search-result", { info });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  const artistId = info.id;
  console.log(artistId);
  spotifyApi
    .getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE")
    .then((data) => {
      console.log("Artist albums", data.body);
    })
    .catch((err) => {
      console.error(err);
    });
});

// app.get("/products", (req, res) => {
//   const data = {}; // will store the data that we send to the view

//   if (req.query.maxPrice) {
//     // read maxPrice from req.query & convert to float number
//     const maxPrice = parseFloat(req.query.maxPrice);

//     // filter products
//     const filteredProducts = products.filter((product) => {
//       return product.price <= maxPrice;
//     });

//     // we will store only the products that meet the condition
//     data.products = filteredProducts;
//   } else {
//     // store all products
//     data.products = products;
//   }

//   res.render("products", data);
// });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
