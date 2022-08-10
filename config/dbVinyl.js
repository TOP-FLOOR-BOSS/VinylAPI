require('dotenv').config();

const { createConnection } = require ('mysql');

const connection = createConnection({
    host: process.env.host ,
    User: process.env.dbuser ,
    password: process.env.dbPassword,
    database: process.env.dbName,
    port: process.env.dbPort 
});

connection.connect( (err)=> {
    if (err) throw err
} );

module.exports = connection;