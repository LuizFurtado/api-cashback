require('dotenv/config');

const express = require('express');
const router = express.Router();
const axios = require('axios');

const Salesperson = require('../models/Salesperson');

/**
 * Cria um novo revendedor.
 * Dados são passados conforme a regra de negócio estabelecida no desafio
 */
router.post('/', async (req, res) => {
    const salesperson = new Salesperson({
        CPF: req.body.CPF,
        nomeCompleto: req.body.nomeCompleto,
        email: req.body.email,
        senha: req.body.senha
    });

    try {
        const newSalesperson = await salesperson.save();
        return res.json(newSalesperson);
    } catch(err) {
        return res.json({ message: err });
    }
})

/**
 * Rota para simular o login.
 * Somente faz a validação de usuário e senha, passados no corpo da requisição.
 * Pode ser implementada autenticação usando JWT e o hash da senha com bcrypt.
 * Devido à falta de conhecimento prático, optei por deixar essas opções de fora.
 */
router.post('/login', async (req, res) => {
    let salesperson;

    try {
        salesperson = await Salesperson.findOne({ email: req.body.email });
        if(salesperson.senha == req.body.password) {
            return res.json("OK! Revendedor autenticado");
        } else {
            return res.json("Senha incorreta!");
        }
    }catch(err) {
        res.json({ message: "Revendedor não encontrado: " + err });
    }    
})

/**
 * Rota para retorno do cashback acumulado
 * Essa rota consome a api externa disponibilizada pelo Boticário para cálculo do cashback acumulado
 * O CPF do revendedor é passado como query params para ser utilizado na chamada da API.
 * Para consumo da API é utilizada a biblioteca AXIOS.
 * A URL da API foi salva no arquivo .env
 */
router.get('/:cpf/cashback', (req, res) => {
    const cpf = req.params.cpf;

    axios.get(`${process.env.BOTICARIO_API_URL}?cpf=${cpf}`)
    .then(response => {
        let cashback = response.data.body.credit;
        cashback = cashback.toFixed(2);
        return res.json({message: `Total de cashback: R$ ${cashback}`});
    })
    .catch(err => {
        return res.json({ message: "Erro ao recuperar valor de cashback: " + err });
    })

})

module.exports = router;