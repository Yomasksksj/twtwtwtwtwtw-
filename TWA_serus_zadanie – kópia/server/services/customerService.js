const customerDAO = require('../data/customerDAO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class CustomerService {
  async createCustomer(customerData) {
    try {
      const existingCustomer = await customerDAO.findByEmail(customerData.email);
      if (existingCustomer) {
        throw new Error('Email already registered');
      }
      
      if (!customerData.datum_registracie) {
        customerData.datum_registracie = new Date().toISOString().split('T')[0];
      }
      
 
      const saltRounds = 10;
      customerData.heslo = await bcrypt.hash(customerData.heslo, saltRounds);
      
      return await customerDAO.create(customerData);
    } catch (error) {
      throw error;
    }
  }
  
  async getAllCustomers() {
    try {
      const customers = await customerDAO.findAll();
      

      return customers.map(customer => {
        const { heslo, ...customerWithoutPassword } = customer;
        return customerWithoutPassword;
      });
    } catch (error) {
      throw error;
    }
  }
  
  async getCustomerById(id) {
    try {
      const customer = await customerDAO.findById(id);
      
      if (!customer) {
        throw new Error('Customer not found');
      }
      

      const { heslo, ...customerWithoutPassword } = customer;
      return customerWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
  
  async updateCustomer(id, customerData) {
    try {

      const customer = await customerDAO.findById(id);
      if (!customer) {
        throw new Error('Customer not found');
      }
 
      if (customerData.heslo) {
        const saltRounds = 10;
        customerData.heslo = await bcrypt.hash(customerData.heslo, saltRounds);
      }
      

      return await customerDAO.update(id, customerData);
    } catch (error) {
      throw error;
    }
  }
  
  async deleteCustomer(id) {
    try {
      return await customerDAO.delete(id);
    } catch (error) {
      throw error;
    }
  }
  
  async login(email, password) {
    try {

      const customer = await customerDAO.findByEmail(email);
      
      if (!customer) {
        throw new Error('Invalid email or password');
      }
      

      const passwordMatch = await bcrypt.compare(password, customer.heslo);
      
      if (!passwordMatch) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { id: customer.id_zakaznik, email: customer.email },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '24h' }
      );
      
      return {
        id: customer.id_zakaznik,
        email: customer.email,
        meno: customer.meno,
        priezvisko: customer.priezvisko,
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CustomerService();