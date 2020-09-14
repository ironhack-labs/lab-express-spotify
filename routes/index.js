const router = require("express").Router();

router.get("/", (req, res) => res.render("home"));

router.get("/artist-search", (req, res) => {
  console.log(req.query);
});

module.exports = router;
