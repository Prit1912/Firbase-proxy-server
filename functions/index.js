/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
require("dotenv");
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// get all orders
app.get("/:data", async (req, res) => {
  try {
    const shopifyBaseUrl = req.headers["shopify-url"];
    const shopifyToken = req.headers["shopify-token"];
    const response = await axios.get(shopifyBaseUrl + req.url, {
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
      },
    });
    return res.status(200).send(response.data || []);
  } catch (error) {
    return res
      .status(error?.response?.status || 400)
      .send(error?.response?.data?.errors || "Could not fetch orders");
  }
});

// get particulare order
app.get("/orders/:data", async (req, res) => {
  try {
    const shopifyBaseUrl = req.headers["shopify-url"];
    const shopifyToken = req.headers["shopify-token"];
    const response = await axios.get(shopifyBaseUrl + req.url, {
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
      },
    });
    return res.status(200).send(response.data || {});
  } catch (error) {
    console.log(error);
    return res
      .status(error?.response?.status || 400)
      .send(error?.response?.data?.errors || "Could not get order");
  }
});

// add order
app.post("/orders.json", async (req, res) => {
  try {
    const shopifyBaseUrl = req.headers["shopify-url"];
    const shopifyToken = req.headers["shopify-token"];
    const response = await axios.post(shopifyBaseUrl + req.url, req.body, {
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
      },
    });
    return res.status(200).send(response.data || "Order added successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(error?.response?.status || 400)
      .send(error?.response?.data?.errors || "Could not add order");
  }
});

// cancel, close or open order
app.post("/orders/:orderId/:action", async (req, res) => {
  try {
    const shopifyBaseUrl = req.headers["shopify-url"];
    const shopifyToken = req.headers["shopify-token"];
    const response = await axios.post(shopifyBaseUrl + req.url, req.body, {
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
      },
    });
    return res.status(200).send(response.data || "Order added successfully");
  } catch (error) {
    return res
      .status(error?.response?.status || 400)
      .send(error?.response?.data?.errors || "Could not update order status");
  }
});

app.put("/orders/:orderId", async (req, res) => {
  try {
    const shopifyBaseUrl = req.headers["shopify-url"];
    const shopifyToken = req.headers["shopify-token"];
    const response = await axios.put(shopifyBaseUrl + req.url, req.body, {
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
      },
    });
    return res.status(200).send(response.data || "Order updated successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(error?.response?.status || 400)
      .send(error?.response?.data?.errors || "Could not update order");
  }
});

app.delete("/orders/:orderId", async (req, res) => {
  try {
    const shopifyBaseUrl = req.headers["shopify-url"];
    const shopifyToken = req.headers["shopify-token"];
    const response = await axios.delete(shopifyBaseUrl + req.url, {
      headers: {
        "X-Shopify-Access-Token": shopifyToken,
      },
    });
    return res.status(200).send(response.data || "Order deleted successfully");
  } catch (error) {
    return res
      .status(error?.response?.status || 400)
      .send(error?.response?.data?.errors || "Could not delete order");
  }
});

exports.appProxy = functions.https.onRequest(app);
