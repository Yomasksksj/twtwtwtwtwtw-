// data/producerDAO.js
const { pool, sql } = require('../config/db.config');

class ProducerDAO {
  async create(producer) {
    const { nazov_spolocnosti, meno, priezvisko, email, telefon, web } = producer;
    
    try {
      await pool.connect();
      
      const query = `
        INSERT INTO eshop.producent (nazov_spolocnosti, meno, priezvisko, email, telefon, web) 
        VALUES (@nazov_spolocnosti, @meno, @priezvisko, @email, @telefon, @web);
        SELECT SCOPE_IDENTITY() AS id;
      `;
      
      const request = pool.request();
      request.input('nazov_spolocnosti', sql.NVarChar, nazov_spolocnosti);
      request.input('meno', sql.NVarChar, meno || null);
      request.input('priezvisko', sql.NVarChar, priezvisko || null);
      request.input('email', sql.NVarChar, email || null);
      request.input('telefon', sql.NVarChar, telefon || null);
      request.input('web', sql.NVarChar, web || null);
      
      const result = await request.query(query);
      const id = result.recordset[0].id;
      
      return {
        id: id,
        message: 'Producer created successfully'
      };
    } catch (error) {
      throw new Error(`Error creating producer: ${error.message}`);
    }
  }

  async findAll() {
    try {
      await pool.connect();
      const result = await pool.request().query('SELECT * FROM eshop.producent');
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching producers: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('id', sql.Int, id);
      const result = await request.query('SELECT * FROM eshop.producent WHERE id_producent = @id');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching producer by ID: ${error.message}`);
    }
  }

  async findByName(name) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('nazov', sql.NVarChar, name);
      const result = await request.query('SELECT * FROM eshop.producent WHERE meno = @nazov');
      return result.recordset;
    } catch (error) {
      throw new Error(`Error finding producer by name: ${error.message}`);
    }
  }

  async update(id, producerData) {
    try {
      await pool.connect();
      
      // Build dynamic query based on provided fields
      const updateFields = [];
      const request = pool.request();
      
      request.input('id', sql.Int, id);
      
      Object.entries(producerData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id_producent') {
          updateFields.push(`${key} = @${key}`);
          
          // Determine SQL type based on data type
          let sqlType;
          if (typeof value === 'string') {
            sqlType = sql.NVarChar;
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
      
      const query = `UPDATE eshop.producent SET ${updateFields.join(', ')} WHERE id_producent = @id; SELECT @@ROWCOUNT AS affectedRows;`;
      
      const result = await request.query(query);
      const affectedRows = result.recordset[0].affectedRows;
      
      if (affectedRows === 0) {
        throw new Error('Producer not found or no changes made');
      }
      
      return {
        message: 'Producer updated successfully',
        affectedRows: affectedRows
      };
    } catch (error) {
      throw new Error(`Error updating producer: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('id', sql.Int, id);
      
      const query = 'DELETE FROM eshop.producent WHERE id_producent = @id; SELECT @@ROWCOUNT AS affectedRows;';
      const result = await request.query(query);
      const affectedRows = result.recordset[0].affectedRows;
      
      if (affectedRows === 0) {
        throw new Error('Producer not found');
      }
      
      return {
        message: `Producer with ID: ${id} deleted successfully`,
        affectedRows: affectedRows
      };
    } catch (error) {
      throw new Error(`Error deleting producer: ${error.message}`);
    }
  }
}

module.exports = new ProducerDAO();