import response from 'express';
//import { subirArchivo } from '../helpers.js';
import { subirArchivo } from '../helpers/subir_archivo.js';
import {Usuario} from '../models/usuario.js';
import {Producto} from '../models/producto.js';
import { model } from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fs from 'fs';
import * as cloudinary from 'cloudinary';
cloudinary.config({
    cloud_name: 'dk2xqpyv0',
    api_key: '733723873616427',
    api_secret: 'ttlHKFAr8JSCurRPFS4zZopZwro',  
});

const cargarArchivo = async(req, res = response) => {
    /*console.log(req.files);
    res.json({
        msg: 'Carga de Archivo'
    });*/

    //ahora esta en el helper
    /*if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg: 'No hay archivos que subir'});
        return;
    }*/

    try{
        //const nombre = await subirArchivo(req.files, ['txt','md'], 'textos');
        //const nombre = await subirArchivo(req.files, undefined, 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'img');
        res.json({
            nombre
        });
    }
    catch(msg){
        res.status(400).json({
            msg
        });
    }
}

const actualizarImagen = async(req, res = response) => {
    //ahora esta en el helper
    /*if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg: 'No hay archivos que subir'});
        return;
    }*/
    
    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Esto no se ha validado'
            });
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();

    res.json({
        modelo
    })
}

const mostrarImagen = async(req, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                //podría enviar na imagen por defecto
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                //podría enviar na imagen por defecto
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Esto no se ha validado'
            });
    }

    //Limpiar imagenes previas
    if(modelo.img){
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }

    const pathImagenAssets = path.join(__dirname,'../assets', 'no-image.jpg');
    res.sendFile(pathImagenAssets);
}

const actualizarImagenCloudinary = async(req, res = response) => {
    //ahora esta en el helper
    /*if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg: 'No hay archivos que subir'});
        return;
    }*/
    
    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Esto no se ha validado'
            });
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //hay que borrar la imagen del servidor
        /*const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }*/
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);

    }
    const {tempFilePath} = req.files.archivo;
    try{
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        modelo.img=secure_url;
        await modelo.save();
        res.json(modelo);
    }
    catch(error){
        res.json(error);
    }
    
    
}

export {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}