import { response } from "express";
import { Categoria } from "../models/categoria.js";
import { Usuario } from "../models/usuario.js";
//import { Categoria } from "../models";

//obetener categorias, paginado, total, populate de mongoose(relacion del usuario, info usuario)
const categoriasGet = async(req = request, res = response) => {
    const {limite=5, desde=0} = req.query;
    const query = {estado:true};
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        categorias
    })

}

//obtener categoria, populate{}
const categoriaGet = async(req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
    res.json(
        categoria
    )
}

const categoriasPost = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    }

    const categoria = new Categoria(data);

    //guardar db
    await categoria.save();
    res.status(201).json(categoria);
}

//actualizar categoria. recibir nombre
const categoriaPut = async(req, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
    res.json(
        categoria
    );
}

//borrar categoria, cambiar estado false
const categoriaDelete = async(req, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new : true});
    res.json(
        categoria
    );
}

export {
    categoriasPost,
    categoriasGet,
    categoriaGet, 
    categoriaPut,
    categoriaDelete
}