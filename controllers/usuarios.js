import { response } from 'express';
import { Usuario } from '../models/usuario.js';
import bcryptjs from 'bcryptjs';


const usuariosGet = async(req = request, res = response) => {
    //res.status(403).json({
    //const {q, nombre = 'No name', apikey, page ='1', limit} = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};
    
    /*const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await Usuario.countDocuments(query);*/

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total, 
        usuarios
        //total,
        //usuarios
    });
}

const usuariosPost = async(req, res= response) => {
    
    //res.status(403).json({
    //const body = req.body;
    //body
    //const {nombre, ... resto} = req.body; Si se necesaita sacar un dato especificamente
    const {nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
    //verificar si el correo existe
    /*const existeEmail = await Usuario.findOne({correo});
    if( existeEmail ){
        return res.status(400).json({
            msg: 'El correo ya esta registrado'
        });
    }*/
    
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //Guardar en base de datos
    await usuario.save();
    res.json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPut = async(req, res) => {
    //res.status(403).json({
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
    //TODO validar contra base de datos
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        //msg: 'put API - controlador',
        usuario
    });
}

const usuariosPatch = (req, res) => {
    //res.status(403).json({
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res) => {
    //res.status(403).json({
    const { id } = req.params;
    //borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id);
    
    //manteniendo integridad referencial
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    res.json({
        usuario
    });
}

export{ usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete }