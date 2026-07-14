// Mock the productModel explicitly to avoid auto-mocking loading the file
jest.mock('../models/productModel', () => ({
  createProduct: jest.fn(),
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

const productController = require('./productController');
const productModel = require('../models/productModel');

describe('Product Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    req = {
      body: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('create', () => {
    it('should return 400 if name or price is missing', async () => {
      req.body = { description: 'test' };

      await productController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name and price are required fields.' });
    });

    it('should create a product and return 201', async () => {
      req.body = { name: 'Test Product', price: '100.50' };
      const createdProduct = { id: 1, name: 'Test Product', price: 100.5, description: null };
      
      productModel.createProduct.mockResolvedValue(createdProduct);

      await productController.create(req, res);

      expect(productModel.createProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        price: 100.5,
        description: undefined
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdProduct);
    });
  });

  describe('getAll', () => {
    it('should return all products with 200 status', async () => {
      const products = [{ id: 1, name: 'Product 1', price: 10 }];
      productModel.getAllProducts.mockResolvedValue(products);

      await productController.getAll(req, res);

      expect(productModel.getAllProducts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });
  });

  describe('getById', () => {
    it('should return 404 if product is not found', async () => {
      req.params.id = '999';
      productModel.getProductById.mockResolvedValue(null);

      await productController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found.' });
    });

    it('should return a product with 200 status if found', async () => {
      req.params.id = '1';
      const product = { id: 1, name: 'Product 1' };
      productModel.getProductById.mockResolvedValue(product);

      await productController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });
  });

  describe('update', () => {
    it('should return 404 if product to update is not found', async () => {
      req.params.id = '999';
      req.body = { name: 'Updated Name' };
      productModel.getProductById.mockResolvedValue(null);

      await productController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should update a product and return 200', async () => {
      req.params.id = '1';
      req.body = { price: 200 };
      const existingProduct = { id: 1, name: 'Old', price: 100, description: 'Desc' };
      const updatedProduct = { id: 1, name: 'Old', price: 200, description: 'Desc' };
      
      productModel.getProductById.mockResolvedValue(existingProduct);
      productModel.updateProduct.mockResolvedValue(updatedProduct);

      await productController.update(req, res);

      expect(productModel.updateProduct).toHaveBeenCalledWith('1', {
        name: 'Old',
        price: 200,
        description: 'Desc'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });
  });

  describe('delete', () => {
    it('should return 404 if product to delete is not found', async () => {
      req.params.id = '999';
      productModel.getProductById.mockResolvedValue(null);

      await productController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should delete a product and return 200', async () => {
      req.params.id = '1';
      const existingProduct = { id: 1, name: 'To Delete' };
      
      productModel.getProductById.mockResolvedValue(existingProduct);
      productModel.deleteProduct.mockResolvedValue(true);

      await productController.delete(req, res);

      expect(productModel.deleteProduct).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully.' });
    });
  });
});
