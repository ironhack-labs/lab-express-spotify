require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const router = require("./routes/index");
const path = require("path");
// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Our routes go here:
app.use("/", router);

app.listen(process.env.PORT, () => console.log(`My Spotify project running on port ${process.env.PORT}`));
