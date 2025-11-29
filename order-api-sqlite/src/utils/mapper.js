// Converte o JSON de entrada para o formato do banco
function mapIncomingToOrderModel(body) {
    if (!body) return null;


    return {
        orderId: body.numeroPedido,
        value: Number(body.valorTotal),
        creationDate: new Date(body.dataCriacao).toISOString(),
        items: Array.isArray(body.items) ? body.items.map(i => ({
            productId: Number(i.idItem),
            quantity: Number(i.quantidadeItem),
            price: Number(i.valorItem)
        })) : []
    };
}


module.exports = { mapIncomingToOrderModel };