import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { v4 as uuidv4 } from 'uuid';

const subirArchivo = (files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        
        const {archivo} = files;
        
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        //Validar la extensión
        if(!extensionesValidas.includes(extension)){
            return reject(`La extensón ${extension} no es válida ${extensionesValidas}`);
        }
        
        const nombreTemp = uuidv4() + "." + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(nombreTemp);
        });
    });
}

export {
    subirArchivo
}