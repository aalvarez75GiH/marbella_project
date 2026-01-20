/* eslint-disable */

require("dotenv").config();

const { onRequest } = require("firebase-functions/v2/https");

// const paymentsRouter = require("./api/payments/payments.routes");
// const companyRouter = require("./api/company/company.routes");
// const ordersRouter = require("./api/orders/orders.routes");
// const storesRouter = require("./api/stores/stores.routes");

const usersRouter = require("./api/users/users.routes");
const cartsRouter = require("./api/carts/cart.routes");
const productsRouter = require("./api/products/products.routes");
const warehousesRouter = require("./api/warehouses/warehouses.routes");
const paymentsRouter = require("./api/payments/payments.routes");
const ordersRouter = require("./api/orders/orders.routes");
const geolocationRouter = require("./api/geolocation/geolocation.routes");

exports.usersendpoint = onRequest(usersRouter);
exports.cartsendpoint = onRequest(cartsRouter);
exports.productsendpoint = onRequest(productsRouter);
exports.warehousesendpoint = onRequest(warehousesRouter);
exports.paymentsendpoint = onRequest(paymentsRouter);
exports.ordersendpoint = onRequest(ordersRouter);
exports.geolocationendpoint = onRequest(geolocationRouter);
