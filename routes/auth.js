import { Router } from 'express';
import { check } from 'express-validator';
import { login, googleSignIn } from '../controllers/auth.js';
import { validarCampos } from '../middlewares/validar_campos.js';

const router = Router();
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login );

router.post('/google',[
    check('id_token', 'id_token es necesario').notEmpty(),
    validarCampos
], googleSignIn );

export{ router }