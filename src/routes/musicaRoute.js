const express = require('express'),
    router = express.Router();

var musicController = require('../controllers/v1/musicController');

router.route('/')
    .post(musicController.cadastrarMusica)
    .get(musicController.buscarMusicas);

router.route('/search')
    .get(musicController.buscarMusicasFiltro);


router.route('/total')
    .get(musicController.getTotalMusics);

router.route('/graph')
    .get(musicController.getGraph);

router.route('/:id')
    .get(musicController.buscarMusicasPorId)
    .delete(musicController.deletarMusica)
    .put(musicController.alterarMusica);

router.route('/device/:deviceid')
    .get(musicController.buscarMusicasDevice);
module.exports = router;