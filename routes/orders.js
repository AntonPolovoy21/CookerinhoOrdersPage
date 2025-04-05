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
    res.redirect('/orders/manageOrders');
});

// Обновление статуса заказа
router.post('/updateOrderStatus/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: req.body.orderStatus },
            { new: true }
        );
        
        if (!order) {
            throw new Error('Заказ не найден');
        }
        
        req.io.emit('statusUpdate', JSON.stringify({
            newStatus: order.orderStatus
        }));
        
        res.redirect('/orders/manageOrders');
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        res.status(500).json({ error: 'Ошибка обновления статуса' });
    }
});

// Отображение страницы с заказами
router.get('/manageOrders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.render('manageOrders', { orders }); // Передаем заказы в шаблон
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;