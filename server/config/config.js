/******************
 *     Puerto
 *******************/
process.env.PORT = process.env.PORT || 3000;

/******************
 *     ENTORNO
 *******************/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/******************
 *     BBDD
 *******************/
let urlDb;

/******************
 *     SEED
 *******************/
process.env.SEED_TOKEN = process.env.SEED_TOKEN ||  'EstaEsLaFirmaDeDesarrollo-202005';

/******************
 *     FECHA TOKEN
 *******************/

// 48h
process.env.CADUCIDAD_TOKEN = '48h';

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://eacademia:aE$$2020#.@localhost:27017/eacademia';
} else {
    urlDb = process.env.MONGO_URI;
}

process.env.URL_BD = urlDb;