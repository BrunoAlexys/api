const request = require('supertest');
const express = require('express');
const productRoutes = require('./productRoutes');
const productController = require('../controllers/productController');

// Mock the controller
jest.mock('../controllers/productController', () => ({
  create: jest.fn((req, res) => res.status(201).json({ id: 1, ...req.body })),
  getAll: jest.fn((req, res) => res.status(200).json([{ id: 1, name: 'Product' }])),
  getById: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: 'Product' })),
  update: jest.fn((req, res) => res.status(200).json({ id: req.params.id, ...req.body })),
  delete: jest.fn((req, res) => res.status(200).json({ message: 'Deleted' })),
}));

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

describe('Product Routes Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /products should call create controller', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Test', price: 100 });
    
    expect(res.statusCode).toEqual(201);
    expect(productController.create).toHaveBeenCalled();
  });

  it('GET /products should call getAll controller', async () => {
    const res = await request(app).get('/products');
    
    expect(res.statusCode).toEqual(200);
    expect(productController.getAll).toHaveBeenCalled();
  });

  it('GET /products/:id should call getById controller', async () => {
    const res = await request(app).get('/products/1');
    
    expect(res.statusCode).toEqual(200);
    expect(productController.getById).toHaveBeenCalled();
  });

  it('PUT /products/:id should call update controller', async () => {
    const res = await request(app)
      .put('/products/1')
      .send({ price: 200 });
    
    expect(res.statusCode).toEqual(200);
    expect(productController.update).toHaveBeenCalled();
  });

  it('DELETE /products/:id should call delete controller', async () => {
    const res = await request(app).delete('/products/1');
    
    expect(res.statusCode).toEqual(200);
    expect(productController.delete).toHaveBeenCalled();
  });
});
