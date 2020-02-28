const mongoose = require('mongoose');

const SalespersonSchema = mongoose.Schema({
    CPF: {
        type: String,
        required: true
    },
    nomeCompleto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    vendas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale"
    }]
})

module.exports = mongoose.model('Salesperson', SalespersonSchema);