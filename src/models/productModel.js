const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

const productModel = {
  // Create a new product
  async createProduct(data) {
    return await prisma.product.create({
      data,
    });
  },

  // Get all products
  async getAllProducts() {
    return await prisma.product.findMany();
  },

  // Get a single product by ID
  async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
  },

  // Update a product by ID
  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id: parseInt(id) },
      data,
    });
  },

  // Delete a product by ID
  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id: parseInt(id) },
    });
  },
};

module.exports = productModel;
