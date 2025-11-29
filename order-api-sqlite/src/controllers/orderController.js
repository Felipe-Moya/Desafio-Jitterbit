const db = require('../../db');
const { mapIncomingToOrderModel } = require('../utils/mapper');


// Criar pedido
function createOrder(req, res, next) {
    try {
        const incoming = req.body;
        if (!incoming || !incoming.numeroPedido) return res.status(400).json({ error: 'numeroPedido é obrigatório' });


        const order = mapIncomingToOrderModel(incoming);

        // Verifica duplicado
        const exists = db.prepare('SELECT 1 FROM "Order" WHERE orderId = ?').get(order.orderId);
        if (exists) return res.status(409).json({ error: 'Pedido com esse orderId já existe' });


        const insertOrder = db.prepare('INSERT INTO "Order" (orderId, value, creationDate) VALUES (?, ?, ?)');
        const insertItem = db.prepare('INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)');


        const insertOrderTxn = db.transaction((o) => {
            insertOrder.run(o.orderId, o.value, o.creationDate);
            for (const it of o.items) {
                insertItem.run(o.orderId, it.productId, it.quantity, it.price);
            }
        });
        insertOrderTxn(order);


        return res.status(201).json({ message: 'Pedido criado', orderId: order.orderId });
    } catch (err) {
            next(err);
        }
}


// Obter pedido
function getOrder(req, res, next) {
    try {
        const orderId = req.params.orderId;
        const order = db.prepare('SELECT * FROM "Order" WHERE orderId = ?').get(orderId);
        if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });


        const items = db.prepare('SELECT productId, quantity, price FROM Items WHERE orderId = ?').all(orderId);
        // Ajusta shape para resposta
        order.items = items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }));


        return res.status(200).json(order);
    } catch (err) { next(err); }
}

// Listar pedidos
function listOrders(req, res, next) {
    try {
        const rows = db.prepare('SELECT * FROM "Order" ORDER BY creationDate DESC').all();
        return res.status(200).json(rows);
    } catch (err) { next(err); }
}


// Atualizar pedido
function updateOrder(req, res, next) {
    try {
        const orderId = req.params.orderId;
        const incoming = req.body;
        const order = mapIncomingToOrderModel(incoming);


        const exists = db.prepare('SELECT 1 FROM "Order" WHERE orderId = ?').get(orderId);
        if (!exists) return res.status(404).json({ error: 'Pedido não encontrado' });


        const updateOrderStmt = db.prepare('UPDATE "Order" SET value = ?, creationDate = ? WHERE orderId = ?');
        const deleteItems = db.prepare('DELETE FROM Items WHERE orderId = ?');
        const insertItem = db.prepare('INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)');


        const txn = db.transaction((o) => {
            updateOrderStmt.run(o.value, o.creationDate, orderId);
            deleteItems.run(orderId);
            for (const it of o.items) {
                insertItem.run(orderId, it.productId, it.quantity, it.price);
            }
        });


        txn(order);


        const updated = db.prepare('SELECT * FROM "Order" WHERE orderId = ?').get(orderId);
        updated.items = db.prepare('SELECT productId, quantity, price FROM Items WHERE orderId = ?').all(orderId);


        return res.status(200).json(updated);
    } catch (err) { next(err); }
}

// Deletar pedido
function deleteOrder(req, res, next) {
    try {
        const orderId = req.params.orderId;
        const delItems = db.prepare('DELETE FROM Items WHERE orderId = ?').run(orderId);
        const del = db.prepare('DELETE FROM "Order" WHERE orderId = ?').run(orderId);
        if (del.changes === 0) return res.status(404).json({ error: 'Pedido não encontrado' });
        return res.status(204).send();
    } catch (err) { next(err); }
}


module.exports = { createOrder, getOrder, listOrders, updateOrder, deleteOrder };