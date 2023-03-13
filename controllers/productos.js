import {response} from 'express';
import { Categoria } from "../models/categoria.js";
import { Usuario } from "../models/usuario.js";
import { Producto } from "../models/producto.js";

//obtener productos
const productosGet = async(req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        productos
    });
}

//obtener producto
const productoGet = async(req, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario','nombre')
        .populate('categoria','nombre');
    res.json(
        producto
    )
}

//crear producto
const productoPost = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const {precio, descripcion, categoria} = req.body;
    const productoDB = await Producto.findOne({nombre});
    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe`
        });
    }

    //generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
        categoria,
        precio,
        descripcion
    }

    const producto = new Producto(data);

    //guardar en la DB
    await producto.save();
    res.status(201).json(producto);
}

//eliminar producto
const productoDelete = async(req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.json(
        producto
    );
}

//actualizar producto
const productoPut = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const {id} = req.params;

    const {
        estado, 
        usuario, 
        precio, 
        categoria, 
        descripcion, 
        disponible} = req.body;
    
    const producto = await Producto.findByIdAndUpdate(id, {
        nombre,
        estado,
        usuario,
        precio,
        categoria,
        descripcion,
        disponible
    },
    {
        new: true
    });
    res.json(
        producto
    )

    //forma 2 profesor
    //const {id} = req.params;
    //const {estado, usuario, ...data} = req.body;
    //if(data.nombre){
    //      data.nombre= data.nombre.toUpperCase(); 
    //}
    //data.usuario = req.usuario._id;
    //const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    //res.json(categoria);

}

export {
    productosGet,
    productoPost,
    productoDelete,
    productoGet,
    productoPut
}