const express = require('express');
const router = express.Router();

const Sale = require('../models/Sales');
const Salesperson = require('../models/Salesperson');

/**
 * Rota padrão para criar uma nova venda.
 * Recebe os dados no corpo do e-mail, e define o status conforme CPF do revendedor.
 * Supõe-se que a validação dos campos é feita no frontend.
 * Código gerado conforme o seguinte padrão: Ano CPF do revendedor Sequencia numérica
 */
router.post('/', async (req, res) => {
    let { CPF, valor } = req.body;
    let cashback = {porcentagem: 0, valor: 0};
    let status = CPF == '15350946056' ? "Aprovado" : "Em validação";
    let contador = 0;
    let vendas = [];

    const ano = new Date().getFullYear();

    await Salesperson.findOne({ cpf: CPF }).populate('vendas').exec((err, foundSalesperson) => {
        if(err) return res.json({ message: "Erro ao carregar vendedor" });

        vendas = foundSalesperson.vendas;
    })

    if(vendas.length == 0) {
        contador = 1;
    } else {
        let ultimaVenda = vendas[vendas.length-1];
        let ultimoContador = ultimaVenda.codigo;
        ultimoContador = ultimoContador.substr(14);
        contador = parseInt(ultimoContador) + 1;
    }

    if(parseFloat(valor) <= 1000.00) {
        cashback.porcentagem = '10%';
        cashback.valor = valor * 0.10;
    } else if(parseFloat(valor) > 1000.00 && parseFloat(valor) <= 1500.00) {
        cashback.porcentagem = '15%';
        cashback.valor = valor * 0.15;
    } else if(parseFloat(valor) > 1500.00) {
        cashback.porcentagem = '20%';
        cashback.valor = valor * 0.20;
    }

    const venda = new Sale({
        codigo: `${ano}${CPF}${contador}`,
        CPF,
        valor: valor.toString(),
        cashback,
        status
    });

    try{
        const novaVenda = await venda.save();
        Salesperson.findOne({ CPF: novaVenda.CPF }, (err, foundSalesperson) => {
            if(err) {
                return res.json({ message: "Revendedor não encontrado"});
            } else {
                foundSalesperson.vendas.push(novaVenda);
                foundSalesperson.save();
            }
        })
        return res.json(novaVenda);
    } catch(err) {
        return res.json({ message: err });
    }

})

/**
 * Rota para modificar uma venda.
 * Supõe-se a utilização do código da venda como atributo key, passado como parametro para a rota.
 * Valor de cashback é recalculado e todo o objeto é repassado para o banco, inclusive dados iguais.
 */
router.put('/:codigo', async (req, res) => {
    const codigo = req.params.codigo;
    let { CPF, valor } = req.body;
    let cashback = {porcentagem: 0, valor: 0};

    if(parseFloat(valor) <= 1000.00) {
        cashback.porcentagem = '10%';
        cashback.valor = valor * 0.10;
    } else if(parseFloat(valor) > 1000.00 && parseFloat(valor) <= 1500.00) {
        cashback.porcentagem = '15%';
        cashback.valor = valor * 0.15;
    } else if(parseFloat(valor) > 1500.00) {
        cashback.porcentagem = '20%';
        cashback.valor = valor * 0.20;
    }

    const venda = new Sale({
        codigo,
        CPF,
        valor: valor.toString(),
        cashback
    });


    try {
        const foundVenda = await Sale.findOne({ codigo: codigo });

        if(foundVenda.status === 'Aprovado') return res.json({ message: 'Venda aprovada - não é possível editar' });

        try {
            const updatedVenda = await Sale.updateOne({ _id: foundVenda._id }, {
                $set: {
                    codigo: venda.codigo,
                    CPF: venda.CPF,
                    valor: venda.valor,
                    cashback: venda.cashback,
                }
            })

            return res.json(updatedVenda);
        } catch(err) {
            return res.json({ message: "Erro ao editar a venda "});
        }
    } catch(err) {
        return res.json({ message: 'Código de venda inválido.'});
    }
    
})

/**
 * Rota para deletar uma venda, conforme o código enviado.
 * Conforme regra de negócio, somente uma venda que ainda não foi aprovada pode ser deletada
 */
router.delete('/:codigo', async (req, res) => {
    try {
        const foundVenda = await Sale.findOne({ codigo: req.params.codigo });

        if(foundVenda.status === "Aprovado") return res.json({ message: "Venda aprovada - não pode ser removida" });

        try{
            const removeVenda = await Sale.deleteOne({ _id: foundVenda._id });
            return res.json({ message: "Removida a venda com sucesso!"});
        } catch(err) {
            return res.json({ message: "Erro ao deletar a venda" });
        }
    } catch(err) {
        return res.json({ message: "Venda não encontrada: " + err });
    }
})

module.exports = router;