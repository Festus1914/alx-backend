// Import required packages
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

// Create Express app
const app = express();
const port = 1245;

// Sample product data
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Connect to Redis
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to get item by id
const getItemById = (id) => {
  return listProducts.find(product => product.itemId === id);
};

// Function to reserve stock in Redis
const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

// Function to get current reserved stock from Redis
const getCurrentReservedStockById = async (itemId) => {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock ? parseInt(reservedStock) : 0;
};

// Route to get list of products
app.get('/list_products', (req, res) => {
  res.json(listProducts.map(product => ({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
  })));
});

// Route to get product details by itemId
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    res.json({ status: 'Product not found' });
  } else {
    const currentQuantity = await getCurrentReservedStockById(itemId);
    res.json({
      itemId: product.itemId,
      itemName: product.itemName,
      price: product.price,
      initialAvailableQuantity: product.initialAvailableQuantity,
      currentQuantity: currentQuantity,
    });
  }
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    res.json({ status: 'Product not found' });
  } else {
    const currentQuantity = await getCurrentReservedStockById(itemId);

    if (currentQuantity < product.initialAvailableQuantity) {
      await reserveStockById(itemId, currentQuantity + 1);
      res.json({ status: 'Reservation confirmed', itemId: itemId });
    } else {
      res.json({ status: 'Not enough stock available', itemId: itemId });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});// Import required packages
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

// Create Express app
const app = express();
const port = 1245;

// Sample product data
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Connect to Redis
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to get item by id
const getItemById = (id) => {
  return listProducts.find(product => product.itemId === id);
};

// Function to reserve stock in Redis
const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

// Function to get current reserved stock from Redis
const getCurrentReservedStockById = async (itemId) => {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock ? parseInt(reservedStock) : 0;
};

// Route to get list of products
app.get('/list_products', (req, res) => {
  res.json(listProducts.map(product => ({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
  })));
});

// Route to get product details by itemId
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    res.json({ status: 'Product not found' });
  } else {
    const currentQuantity = await getCurrentReservedStockById(itemId);
    res.json({
      itemId: product.itemId,
      itemName: product.itemName,
      price: product.price,
      initialAvailableQuantity: product.initialAvailableQuantity,
      currentQuantity: currentQuantity,
    });
  }
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    res.json({ status: 'Product not found' });
  } else {
    const currentQuantity = await getCurrentReservedStockById(itemId);

    if (currentQuantity < product.initialAvailableQuantity) {
      await reserveStockById(itemId, currentQuantity + 1);
      res.json({ status: 'Reservation confirmed', itemId: itemId });
    } else {
      res.json({ status: 'Not enough stock available', itemId: itemId });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
