import {Role} from '../models/role.js';
import { Usuario } from '../models/usuario.js';
import { Categoria } from '../models/categoria.js';
import { Producto } from '../models/producto.js';

const esRolValido = async(rol = '') =>{
    const existeRol = await Role.findOne({rol});
    if( !existeRol ){
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

const emailExiste = async(correo = '') =>{
    const existeEmail = await Usuario.findOne({correo});
    if( existeEmail ){
        throw new Error(`El correo ${correo} ya esta registrado`)
    }
}

const existeUsuarioPorId = async( id ) =>{
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ){
        throw new Error(`El id ${id} no existe`)
    }
}

const existeCategoria = async(id) =>{
    const existeCategoriaID = await Categoria.findById(id);
    if(!existeCategoriaID){
        throw new Error(`El id ${id} no existe`)
    }
}

const existeProducto = async(id) =>{
    const existeProductoID = await Producto.findById(id);
    if(!existeProductoID){
        throw new Error(`El id ${id} no existe`)
    }
}

//validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }
    return true;
}

export { esRolValido, 
        emailExiste, 
        existeUsuarioPorId, 
        existeCategoria,
        existeProducto,
        coleccionesPermitidas
}