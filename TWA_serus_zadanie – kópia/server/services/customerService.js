const customerDAO = require('../data/customerDAO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class CustomerService {
  async createCustomer(customerData) {
    try {
      // Skontrolujte, či e-mail už existuje
      const existingCustomer = await customerDAO.findByEmail(customerData.email);
      if (existingCustomer) {
        throw new Error('Email already registered');
      }

      // Nastavte dátum registrácie, ak nie je poskytnutý
      if (!customerData.datum_registracie) {
        customerData.datum_registracie = new Date().toISOString().split('T')[0];
      }

      // Hashovanie hesla
      const saltRounds = 10;
      customerData.heslo = await bcrypt.hash(customerData.heslo, saltRounds);

      // Vytvorenie zákazníka
      return await customerDAO.create(customerData);
    } catch (error) {
      throw error;
    }
  }

  async getAllCustomers() {
    try {
      const customers = await customerDAO.findAll();

      // Odstránenie hesiel z odpovede
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

      // Odstránenie hesla z odpovede
      const { heslo, ...customerWithoutPassword } = customer;
      return customerWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async updateCustomer(id, customerData) {
    try {
      // Skontrolujte, či zákazník existuje
      const customer = await customerDAO.findById(id);
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Ak je poskytnuté nové heslo, hashujte ho
      if (customerData.heslo) {
        const saltRounds = 10;
        customerData.heslo = await bcrypt.hash(customerData.heslo, saltRounds);
      }

      // Aktualizácia zákazníka
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
      // Nájdite zákazníka podľa e-mailu
      const customer = await customerDAO.findByEmail(email);

      if (!customer) {
        throw new Error('Invalid email or password');
      }

      // Porovnanie hesla
      const passwordMatch = await bcrypt.compare(password, customer.heslo);

      if (!passwordMatch) {
        throw new Error('Invalid email or password');
      }

      // Generovanie JWT tokenu
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