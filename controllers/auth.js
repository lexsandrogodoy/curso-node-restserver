import { response } from 'express';
import { Usuario } from '../models/usuario.js';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar_jwt.js';
import { googleVerify } from '../helpers/google_verify.js';

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

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;
    try{
        const {nombre, img, correo} = await googleVerify(id_token);
        //const googleUser = await googleVerify(id_token);
        //console.log(googleUser);
        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    }
    catch(error){
        res.status(400).json({
            ok: false,
            msg: 'El token no se verifico'
        })
    }
    
}

export{ login, googleSignIn }