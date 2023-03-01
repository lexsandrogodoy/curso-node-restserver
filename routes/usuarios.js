import { Router } from 'express';
import { check } from 'express-validator';
import { usuariosDelete, usuariosGet, usuariosPatch, usuariosPost, usuariosPut } from '../controllers/usuarios.js';
import { esRolValido, emailExiste, existeUsuarioPorId } from '../helpers/db_validators.js';

/*import { validarCampos } from '../middlewares/validar_campos.js';
import { validarJWT } from '../middlewares/validar_jwt.js';
import { esAdminRole, tieneRole } from '../middlewares/validar_roles.js';*/
import { validarCampos, 
    validarJWT, 
    esAdminRole, 
    tieneRole 
} from '../middlewares/index.js'; 

const router = Router();

router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPut );

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe tener más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPost );

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );

export{ router }
