const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const ordersRouter = require('./routes/orders');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Настройка веб-сокетов
io.on('connection', (socket) => {
    console.log('A user connected');

    // Обработка получения нового заказа
    socket.on('new_order', (order) => {
        const newOrder = new Order(order); // Используйте модель Order из order.js
        newOrder.save().then(() => {
            io.emit('order_added', newOrder);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Middleware
app.use(express.json());
app.use('/orders', ordersRouter);

// Запуск сервера
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});