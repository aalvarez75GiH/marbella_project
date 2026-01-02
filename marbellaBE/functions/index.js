/* eslint-disable */

const { onRequest } = require("firebase-functions/v2/https");

// const paymentsRouter = require("./api/payments/payments.routes");
// const companyRouter = require("./api/company/company.routes");
// const ordersRouter = require("./api/orders/orders.routes");
// const storesRouter = require("./api/stores/stores.routes");

const usersRouter = require("./api/users/users.routes");
const cartsRouter = require("./api/carts/cart.routes");
const productsRouter = require("./api/products/products.routes");
const warehousesRouter = require("./api/warehouses/warehouses.routes");

exports.usersendpoint = onRequest(usersRouter);
exports.cartsendpoint = onRequest(cartsRouter);
exports.productsendpoint = onRequest(productsRouter);
exports.warehousesendpoint = onRequest(warehousesRouter);
