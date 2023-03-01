import { response } from 'express';
import { Usuario } from '../models/usuario.js';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar_jwt.js';

const login = async(req, res = response) => {

    const {correo, password} = req.body;
    try{
        //verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario - Contraseña no son correctos - Correo'
            });
        }

        //verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario Inactivo'
            });
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario - Contraseña no son correctos - Password'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login ok',
            usuario,
            token
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
    
}

export{ login }