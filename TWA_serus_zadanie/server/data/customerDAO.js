// data/customerDAO.js
const { pool, sql } = require('../config/db.config');

class CustomerDAO {
  async create(customer) {
    const { meno, priezvisko, email, telefon, ulica, mesto, psc, datum_registracie, heslo } = customer;
    
    try {
      await pool.connect();
      
      const query = `
        INSERT INTO eshop.zakaznik (meno, priezvisko, email, telefon, ulica, mesto, psc, datum_registracie, heslo) 
        VALUES (@meno, @priezvisko, @email, @telefon, @ulica, @mesto, @psc, @datum_registracie, @heslo);
        SELECT SCOPE_IDENTITY() AS id;
      `;
      
      const request = pool.request();
      request.input('meno', sql.NVarChar, meno);
      request.input('priezvisko', sql.NVarChar, priezvisko);
      request.input('email', sql.NVarChar, email);
      request.input('telefon', sql.NVarChar, telefon || null);
      request.input('ulica', sql.NVarChar, ulica || null);
      request.input('mesto', sql.NVarChar, mesto || null);
      request.input('psc', sql.NVarChar, psc || null);
      request.input('datum_registracie', sql.Date, datum_registracie || null);
      request.input('heslo', sql.NVarChar, heslo);
      
      const result = await request.query(query);
      const id = result.recordset[0].id;
      
      return {
        id: id,
        message: 'Customer created successfully'
      };
    } 
    catch (error) {
      throw new Error(`Error creating customer: ${error.message}`);
    }
  }

  async findAll() {
    try {
      await pool.connect();
      const result = await pool.request().query('SELECT * FROM eshop.zakaznik');
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('id', sql.Int, id);
      const result = await request.query('SELECT * FROM eshop.zakaznik WHERE id_zakaznik = @id');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching customer by ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('email', sql.NVarChar, email);
      const result = await request.query('SELECT * FROM eshop.zakaznik WHERE email = @email');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching customer by email: ${error.message}`);
    }
  }

  async update(id, customerData) {
    try {
      await pool.connect();
      
      // Build dynamic query based on provided fields
      const updateFields = [];
      const request = pool.request();
      
      request.input('id', sql.Int, id);
      
      Object.entries(customerData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id_zakaznik') {
          updateFields.push(`${key} = @${key}`);
          
          // Determine SQL type based on data type
          let sqlType;
          if (typeof value === 'string') {
            if (key === 'datum_registracie') {
              sqlType = sql.Date;
            } else {
              sqlType = sql.NVarChar;
            }
          } else if (typeof value === 'number') {
            sqlType = sql.Int;
          } else {
            sqlType = sql.NVarChar;
          }
          
          request.input(key, sqlType, value);
        }
      });
      
      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }
      
      const query = `UPDATE eshop.zakaznik SET ${updateFields.join(', ')} WHERE id_zakaznik = @id; SELECT @@ROWCOUNT AS affectedRows;`;
      
      const result = await request.query(query);
      const affectedRows = result.recordset[0].affectedRows;
      
      if (affectedRows === 0) {
        throw new Error('Customer not found or no changes made');
      }
      
    return {
      message: 'Customer updated successfully',
      affectedRows: affectedRows
    };
    } catch (error) {
      throw new Error(`Error updating customer: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('id', sql.Int, id);
      
      const query = 'DELETE FROM eshop.zakaznik WHERE id_zakaznik = @id; SELECT @@ROWCOUNT AS affectedRows;';
      const result = await request.query(query);
      const affectedRows = result.recordset[0].affectedRows;
      
      if (affectedRows === 0) {
        throw new Error('Customer not found');
      }
      
      return {
        message: `Customer with ID: ${id} deleted successfully`,
        affectedRows: affectedRows
      };
    } catch (error) {
      throw new Error(`Error deleting customer: ${error.message}`);
    }
  }
}

module.exports = new CustomerDAO();