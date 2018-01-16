const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotify.controllers');

router.get("/index", spotifyController.index );
router.get("/artists", spotifyController.artists );
/* router.get("/new", dronesController.new );

router.post("/", dronesController.create );
router.get("/:id", dronesController.show);

router.post("/:id/edit", dronesController.edit);
router.post("/:id", dronesController.update);
router.post("/delete/:id", dronesController.delete); */

module.exports = router;