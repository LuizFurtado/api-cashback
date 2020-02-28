/** 
 * Usada a biblioteca dotenv para criar arquivo de configurações de ambiente.
 * Valores de URL do banco e URL da API estão nesse arquivo.
*/
require('dotenv/config');

const express = require('express');
const mongoose = require('mongoose');

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

/**
 * Rotas do Express foram movidas para arquivos externos,
 * para uma melhor organização do código.
 */
const salespersonRoute = require('./routes/salesperson');
const saleRoute = require('./routes/sales');
server.use('/revendedor', salespersonRoute);
server.use('/venda', saleRoute);

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err) return console.log("Error connecting to database: " + err);

    console.log("Connected to Mongo database");
})

server.listen(3000, () => {
    console.log("Server running on port 3000");
})
