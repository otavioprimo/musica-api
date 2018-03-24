const express = require('express'),
    app = express(),
    db = require('../../config/database'),
    HttpStatus = require('http-status-codes'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    generateToken = require('../../utils/generateToken');

const Op = db.Sequelize.Op;
let Musica = db.musica;

exports.cadastrarMusica = async (req, res) => {
    req.checkBody("artista", "Necessário um artista").exists();
    req.checkBody("nome", "Necessário um nome para a musica").exists();

    if (!req.files) {
        res.status(HttpStatus.OK).json({ error: true, mensagem: "Sem arquivos para upload" });
        return;
    }

    var errors = req.validationErrors();
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).json(errors);
        return;
    } else {

        try {
            //cria o nome do arquivo
            let arquivo = await generateToken();
            let file = req.files.arquivo; //Pega a imagem do request

            let error = await file.mv('./public/musicas/' + arquivo + '.mp3'); //Salva a imagem localmente

            if (error)
                return res.status(500).json({ error: true, mensagem: "Ocorreu um erro ao alterar a cadastrar a musica", errmsg: error });

            await Musica.create({ artist: req.body.artista, name: req.body.nome, source: 'http://musica-app-com-br.umbler.net//public/musicas/' + arquivo + '.mp3' });

            res.status(HttpStatus.OK).json({ error: false, mensagem: "Cadastrado com sucesso" });
        } catch (err) {
            res.status(HttpStatus.Ok).json({ error: true, mensagem: "Ocorreu um erro ao cadastrar a musica", errmsg: err });
        }
    }
}

exports.buscarMusicas = async (req, res) => {
    if (!req.query.page || !req.query.limit) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: true,
            mensagem: "Parametros inválidos",
            page: "Necessário parametro 'page'",
            limit: "Necessário parametro 'limit'"
        });
        return;
    }

    let page = Number(req.query.page) - 1;

    let musicas = await Musica.findAll({
        where: {
            status: true
        },
        order: [
            ['name', 'DESC']
        ],
        offset: Number(page),
        limit: Number(req.query.limit)
    });

    res.status(HttpStatus.OK).json(musicas);
}

exports.buscarMusicasFiltro = async (req, res) => {
    if (!req.query.page || !req.query.limit || !req.query.nome) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: true,
            mensagem: "Parametros inválidos",
            page: "Necessário parametro 'page'",
            limit: "Necessário parametro 'limit'",
            nome:"Necessário um nome para musica"
        });
        return;
    }

    let page = Number(req.query.page) - 1;

    let musicas = await Musica.findAll({
        where: {
            status: true,
            name: {
                [Op.like]: '%' + req.query.nome + '%'
            }
        },
        order: [
            ['name', 'DESC']
        ],
        offset: Number(page),
        limit: Number(req.query.limit)
    });

    res.status(HttpStatus.OK).json(musicas);
}