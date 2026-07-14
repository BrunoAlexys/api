const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Routes
app.use('/products', productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base route for health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Product API!' });
});

// Handle 404 (Not Found)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

module.exports = app;
