import { response } from 'express';

const usuariosGet = (req = request, res = response) => {
    //res.status(403).json({
    const {q, nombre = 'No name', apikey, page ='1', limit} = req.query;
    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req, res= response) => {
    //res.status(403).json({
    //const body = req.body;
    //body
    const {nombre, edad} = req.body;
    res.json({
        msg: 'post API - controlador',
        nombre, edad
    });
}

const usuariosPut = (req, res) => {
    //res.status(403).json({
    const { id } = req.params;
    res.json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosPatch = (req, res) => {
    //res.status(403).json({
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res) => {
    //res.status(403).json({
    res.json({
        msg: 'delete API - controlador'
    });
}

export{ usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete }