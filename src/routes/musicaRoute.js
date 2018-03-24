const express = require('express'),
    router = express.Router();

var musicController = require('../controllers/v1/musicController');

router.route('/')
    .post(musicController.cadastrarMusica)
    .get(musicController.buscarMusicas);

router.route('/search')
    .get(musicController.buscarMusicasFiltro);

module.exports = router;