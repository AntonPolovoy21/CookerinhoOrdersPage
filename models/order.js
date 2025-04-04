const mongoose = require('mongoose');

// Определение схемы блюда
const dishSchema = new mongoose.Schema({
    name: { type: String, required: true } // Название блюда
});

// Определение схемы заказа
const orderSchema = new mongoose.Schema({
    dishes: [dishSchema], // Массив блюд в заказе
    customer: { type: String, required: true }, // Имя клиента
    pickUp: { type: String, required: true }, // Через сколько заберет заказ
    paymentMethod: { type: String, required: true }, // Способ оплаты
    totalPrice: { type: Number, required: true }, // Общая стоимость заказа
    orderStatus: { type: String, required: true }, // Статус заказа
});

// Экспорт модели заказа
module.exports = mongoose.model('Order', orderSchema);