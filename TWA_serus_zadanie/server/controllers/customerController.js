// controllers/customerController.js
const customerService = require('../services/customerService');

class CustomerController {
  async create(req, res) {
    try {
      const result = await customerService.createCustomer(req.body);
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(error.message === 'Email already registered' ? 409 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  
  async getAll(req, res) {
    try {
      const customers = await customerService.getAllCustomers();
      res.status(200).json({
        status: 'success',
        data: customers
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  
  async getById(req, res) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: customer
      });
    } catch (error) {
      res.status(error.message === 'Customer not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  
  async update(req, res) {
    try {
      const id = req.params.id;
      const updatedCustomer = await customerService.updateCustomer(id, req.body);
      res.status(200).json({
        status: 'success',
        data: updatedCustomer
      });
    } catch (error) {
      res.status(error.message === 'Customer not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  async update(req, res) {
  try {
    const id = req.params.id;
    const updatedCustomer = await customerService.updateCustomer(id, req.body);
    res.status(200).json({
      status: 'success',
      data: updatedCustomer
    });
  } catch (error) {
    res.status(error.message === 'Customer not found' ? 404 : 500).json({
      status: 'error',
      message: error.message
    });
  }
}
  
  async delete(req, res) {
    try {
      const result = await customerService.deleteCustomer(req.params.id);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(error.message === 'Customer not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  
  async login(req, res) {
    try {
      const { email, heslo } = req.body;
      const result = await customerService.login(email, heslo);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new CustomerController();