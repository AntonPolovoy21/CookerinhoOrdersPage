const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const ordersRouter = require('./routes/orders');

const app = express();
const server = http.createServer(app);

const io = new Server(server);
// Передача io в req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', 'views'); // Папка для шаблонов

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Для обработки данных форм
app.use('/orders', ordersRouter);
app.use(express.static('public'));

// Обработка WebSocket соединений
io.on('connection', (socket) => {
    console.log('Client connected');

    // Обработка события изменения статуса заказа
    socket.on('updateOrderStatus', (orderId, newStatus) => {
        // Здесь вы можете обновить статус заказа в базе данных
        // Например, с использованием Mongoose

        // После обновления статуса, отправьте обновление всем подключенным клиентам
        io.emit('orderStatusUpdated', { orderId, newStatus });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Запуск сервера
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    console.log('Page with orders is running on http://localhost:3000/orders/manageOrders');
});