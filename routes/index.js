const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index.hbs");
});

module.exports = router;
