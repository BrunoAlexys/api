const productModel = require('../models/productModel');

const productController = {
  // POST /products
  async create(req, res) {
    try {
      const { name, price, description } = req.body;
      
      // Basic validation
      if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required fields.' });
      }

      const newProduct = await productModel.createProduct({
        name,
        price: parseFloat(price),
        description,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error while creating product.', details: error.message });
    }
  },

  // GET /products
  async getAll(req, res) {
    try {
      const products = await productModel.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error while fetching products.' });
    }
  },

  // GET /products/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await productModel.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error while fetching product.' });
    }
  },

  // PUT /products/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, description } = req.body;

      // Check if product exists
      const existingProduct = await productModel.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      const updatedProduct = await productModel.updateProduct(id, {
        name: name !== undefined ? name : existingProduct.name,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        description: description !== undefined ? description : existingProduct.description,
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error while updating product.' });
    }
  },

  // DELETE /products/:id
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Check if product exists
      const existingProduct = await productModel.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      await productModel.deleteProduct(id);
      res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error while deleting product.' });
    }
  },
};

module.exports = productController;
