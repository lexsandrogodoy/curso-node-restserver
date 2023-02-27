import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

const dbConnection = async() => {
    try{
        mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Base de datos conectada');
    }
    catch (error){
        console.log(error);
        throw new Error('Error al iniciar a la base de datos');
    }
}

export {dbConnection}