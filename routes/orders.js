const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Получение всех заказов
router.get('/allOrders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// Создание нового заказа
router.post('/makeNewOrder', async (req, res) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ id: newOrder._id, message: "Order created successfully" });
});

// Изменение статуса заказа
router.put('/updateOrderStatus/:id', async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true } // Возвращаем обновленный документ
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;