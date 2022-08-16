// const { createConnection } = require("mysql");
// // Create connection variable
// let connection;
// // Problem solved
// (function handleConnection() {
//   connection = createConnection({
//     host: process.env.host,
//     user: process.env.dbUser,
//     password: process.env.dbPassword,
//     port: process.env.dbPort,
//     database: process.env.dbName,
//     multipleStatements: true,
//   });

//   // connection.connect( (err)=> {
//   //     if(err) throw err
//   // });

//   // connection.on('error', (err)=> {
//   //     if(err.code === 'PROTOCOL_CONNECTION_LOST'){
//   //         handleConnection();
//   //     }else {
//   //         throw err;
//   //     }
//   // })
// })();
// module.exports = connection;

const mysql = require("mysql");
require("dotenv").config();
const { createPool } = require("mysql");
// Here to is use across multiple files. Used to make SQL queries to DB
const con = createPool({
  host: process.env.host,
  user: process.env.dbUser,
  password: process.env.dbPassword,
  port: process.env.dbPort,
  database: process.env.dbName,
  multipleStatements: true,
  connectionLimit: 10,
});

module.exports = con;
