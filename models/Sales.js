const mongoose = require('mongoose');

const SaleSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true
    },
    CPF: {
        type: String,
        required: true
    },
    valor: {
        type: String,
        required: true
    },
    cashback: {
        porcentagem: String,
        valor: String
    },
    data: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Em validação"
    }
})

module.exports = mongoose.model('Sale', SaleSchema);