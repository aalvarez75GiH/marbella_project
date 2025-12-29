/* eslint-disable */

// const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
// const { admin, db } = require("./fb"); // ✅ same initialized admin

// const admin = require("firebase-admin");
// admin.initializeApp();
// const productsRouter = require("./api/products/products.routes");
// const warehousesRouter = require("./api/warehouses/warehouses.routes");
// const paymentsRouter = require("./api/payments/payments.routes");
// const companyRouter = require("./api/company/company.routes");
// const ordersRouter = require("./api/orders/orders.routes");
// const storesRouter = require("./api/stores/stores.routes");
const usersRouter = require("./api/users/users.routes");
const cartsRouter = require("./api/carts/cart.routes");
// ********** express configuration

// *************************************************
// exports.usersEndPoint = functions.https.onRequest(usersRouter);
// exports.cartsEndPoint = functions.https.onRequest(cartsRouter);

exports.usersendpoint = onRequest(usersRouter);
exports.cartsendpoint = onRequest(cartsRouter);
// exports["users-endpoint"] = onRequest(usersRouter);
// exports["carts-endpoint"] = onRequest(cartsRouter);
