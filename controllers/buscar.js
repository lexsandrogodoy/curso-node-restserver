import { response } from "express";
import mongoose from "mongoose";
import {Usuario} from "../models/usuario.js"
import {Categoria} from "../models/categoria.js"
import {Producto} from "../models/producto.js"

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
    'productoscategoria'
];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoID = mongoose.Types.ObjectId.isValid(termino); //true or false

    if( esMongoID ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    const regex = new RegExp(termino, 'i');

    //const usuarios = await Usuario.count({
    const usuarios = await Usuario.find({
        //$or: [{nombre: regex, estado: true},{correo: regex, estado: true}]
        $or: [{nombre: regex},{correo: regex}],
        $and: [{estado:true}]
    });

    res.json({
        results: usuarios
    });
}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{nombre: regex},{descripcion: regex}],
        $and: [{estado:true}]
    })
    .populate('categoria','nombre');;
    res.json({
        results: productos
    });
}
const buscarCategorias = async(termino = '', res = response) => {
    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regex, estado: true});
    res.json({
        results: categorias
    });
}

//buscar todos los productos de una categoria en Mongodb
//{categoria: ObjectId('640813909625d43d950c055b')}
const buscarProductosCategoria = async(termino = '', res = response) => {
    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if(esMongoID){
        const productos = await Producto.find({categoria: termino});
        return res.json({
            results: productos
        });
    }
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regex, estado: true});
    if(!categorias.length){
        return res.status(400).json({
            msg: `No hay resultados para ${termino}`
        })
    }
    const productos = await Producto.find({
        $or: [...categorias.map(categoria => ({
            categoria: categoria._id
        }))],
        $and: [{estado: true}]
    })
    .populate('categoria','nombre')
    res.json({
        results: productos
    });
}

const buscar = (req, res = response) => {
    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }
    switch (coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        
        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;
        
        case 'productoscategoria':
            buscarProductosCategoria(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Búsqueda no realizada'
            })
    }

    /*
    res.json({
        coleccion,
        termino
    })
    */
}

export{
    buscar
}