const express = require("express"),
    app = express(),
    db = require("../../config/database"),
    HttpStatus = require("http-status-codes"),
    async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    generateToken = require("../../utils/generateToken");

const Op = db.Sequelize.Op;
let Musica = db.musica;

exports.cadastrarMusica = async (req, res) => {
    req.checkBody("artista", "Necessário um artista").exists();
    req.checkBody("nome", "Necessário um nome para a musica").exists();
    req.checkBody("deviceid", "Necessário o deviceId").exists();

    if (!req.files) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: true, mensagem: "Sem arquivos para upload" });
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

            let error = await file.mv("./public/musicas/" + arquivo + ".mp3"); //Salva o arquivo localmente

            if (error)
                return res.status(500).json({ error: true, mensagem: "Ocorreu um erro ao alterar a cadastrar a musica", errmsg: error });

            await Musica.create({ artist: req.body.artista, name: req.body.nome, deviceid: req.body.deviceid, source: "http://music-app-com-br.umbler.net/static/musicas/" + arquivo + ".mp3" });

            res.status(HttpStatus.OK).json({ error: false, mensagem: "Cadastrado com sucesso" });
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Ocorreu um erro ao cadastrar a musica", errmsg: err });
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

    let offset = (Number(req.query.page) - 1) * req.query.limit;

    let musicas = await Musica.findAll({
        where: {
            status: true
        },
        order: [
            ["id", "DESC"]
        ],
        offset: Number(offset),
        limit: Number(req.query.limit)
    });

    res.status(HttpStatus.OK).json(musicas);
}

exports.buscarMusicasDevice = async (req, res) => {
    if (!req.query.page || !req.query.limit) {
        res.status(HttpStatus.BAD_REQUEST).json({
            error: true,
            mensagem: "Parametros inválidos",
            page: "Necessário parametro 'page'",
            limit: "Necessário parametro 'limit'",
        });
        return;
    }

    let offset = (Number(req.query.page) - 1) * req.query.limit;

    let musicas = await Musica.findAll({
        where: {
            status: true,
            deviceid: req.params.deviceid
        },
        order: [
            ["id", "DESC"]
        ],
        offset: Number(offset),
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
            nome: "Necessário um nome para musica"
        });
        return;
    }

    let page = Number(req.query.page) - 1;

    let musicas = await Musica.findAll({
        where: {
            status: true,
            [Op.or]: [
                {
                    name: {
                        [Op.like]: "%" + req.query.nome + "%"
                    }
                }, {
                    artist: {
                        [Op.like]: "%" + req.query.nome + "%"
                    }
                }
            ]
        },
        order: [
            ["name", "DESC"]
        ],
        offset: Number(page),
        limit: Number(req.query.limit)
    });

    res.status(HttpStatus.OK).json(musicas);
}

exports.buscarMusicasPorId = async (req, res) => {
    let musica = await Musica.findById(req.params.id);

    if (musica) {
        res.status(HttpStatus.OK).json(musica);
    } else {
        res.status(HttpStatus.NOT_FOUND).json({ mensagem: "Música não encontrada" });
    }
}

exports.deletarMusica = async (req, res) => {
    let musica = await Musica.find({
        where: {
            id: req.params.id
        }
    });

    let result = await musica.update({
        status: false
    });

    res.status(HttpStatus.OK).json({ mensagem: "Deletado com sucesso" });
}

exports.alterarMusica = async (req, res) => {
    req.checkBody("artista", "Necessário um artista").exists();
    req.checkBody("nome", "Necessário um nome para a musica").exists();
    req.checkBody("deviceid", "Necessário o deviceId").exists();

    var errors = req.validationErrors();
    if (errors) {
        res.status(HttpStatus.BAD_REQUEST).json(errors);
        return;
    } else {
        let musica = await Musica.find({
            where: {
                id: req.params.id
            }
        });

        if (!musica) {
            res.status(HttpStatus.NOT_FOUND).json({ mensagem: "Música não encontrada" });
            return;
        }

        if (musica.deviceid != req.body.deviceid) {
            res.status(HttpStatus.OK).json({ mensagem: "Você não tem permissão para alterar esta música" });
            return;
        }

        let result = await musica.update({
            artist: req.body.artista,
            name: req.body.nome
        });

        res.status(HttpStatus.OK).json({ mensagem: "Alterado com sucesso" });
    }
}

exports.getTotalMusics = async (req, res) => {
    db.sequelize.query("SELECT count(*) as total FROM musicas ").spread((results, metadata) => {
        res.status(HttpStatus.OK).send(results[0]);
    });
}

exports.getGraph = async (req, res) => {
    db.sequelize.query(
        `select  date_format(created_at,'%m') as month,date_format(created_at,'%Y') as year,count(*) as quantity 
        from musicas where date_format(created_at,'%y') = date_format(now(),'%y')
        GROUP BY date_format(created_at,'%m/%y');`
    ).spread((results, metadata) => {
        res.status(HttpStatus.OK).send(results);
    });
}