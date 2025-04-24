
const { pool, sql } = require('../config/db.config');

class TrackDAO {
  async create(track) {
    const { nazov, interpret_meno, interpret_priezvisko, rok_vydania, cena, dostupnost, popis } = track;
    
    try {
      await pool.connect();
      
      const query = `
        INSERT INTO eshop.skladba (nazov, interpret_meno, interpret_priezvisko, rok_vydania, cena, dostupnost, popis) 
        VALUES (@nazov, @interpret_meno, @interpret_priezvisko, @rok_vydania, @cena, @dostupnost, @popis);
        SELECT SCOPE_IDENTITY() AS id;
      `;
      
      const request = pool.request();
      request.input('nazov', sql.NVarChar, nazov);
      request.input('interpret_meno', sql.NVarChar, interpret_meno);
      request.input('interpret_priezvisko', sql.NVarChar, interpret_priezvisko);
      request.input('rok_vydania', sql.Int, rok_vydania);
      request.input('cena', sql.Decimal(10, 2), cena);
      request.input('dostupnost', sql.NVarChar, dostupnost || 'Dostupná');
      request.input('popis', sql.NVarChar, popis || null);
      
      const result = await request.query(query);
      const id = result.recordset[0].id;
      
      return {
        id: id,
        message: 'Track created successfully'
      };
    } catch (error) {
      throw new Error(`Error creating track: ${error.message}`);
    }
  }

  async findAll() {
    try {
      await pool.connect();
      const result = await pool.request().query('SELECT * FROM eshop.skladba');
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching tracks: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('id', sql.Int, id);
      const result = await request.query('SELECT * FROM eshop.skladba WHERE id_skladby = @id');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching track by ID: ${error.message}`);
    }
  }
  async findByName(name) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('nazov', sql.NVarChar, name);
      const result = await request.query('SELECT * FROM eshop.skladba WHERE nazov = @nazov');
      return result.recordset;
    } catch (error) {
      throw new Error(`Error finding track by name: ${error.message}`);
    }
  }
  async findByNameAndArtist(name, firstName, lastName) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('nazov', sql.NVarChar, name);
      request.input('meno', sql.NVarChar, firstName);
      request.input('priezvisko', sql.NVarChar, lastName);
      
      const query = `
        SELECT * FROM eshop.skladba 
        WHERE nazov = @nazov 
        AND interpret_meno = @meno 
        AND interpret_priezvisko = @priezvisko
      `;
      
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error finding track by name and artist: ${error.message}`);
    }
  }

  async update(id, trackData) {
    try {
      await pool.connect();
      
      // Vytvorenie dynamického dotazu na základe poskytnutých polí
      const updateFields = [];
      const request = pool.request();
      
      request.input('id', sql.Int, id);
      
      Object.entries(trackData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id_skladby') {
          updateFields.push(`${key} = @${key}`);
          
          // Určenie SQL typu na základe typu dát
          let sqlType;
          if (typeof value === 'string') {
            sqlType = sql.NVarChar;
          } else if (typeof value === 'number') {
            if (key === 'cena') {
              sqlType = sql.Decimal(10, 2);
            } else {
              sqlType = sql.Int;
            }
          } else {
            sqlType = sql.NVarChar;
          }
          
          request.input(key, sqlType, value);
        }
      });
      
      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }
      
      const query = `UPDATE eshop.skladba SET ${updateFields.join(', ')} WHERE id_skladby = @id; SELECT @@ROWCOUNT AS affectedRows;`;
      
      const result = await request.query(query);
      const affectedRows = result.recordset[0].affectedRows;
      
      if (affectedRows === 0) {
        throw new Error('Track not found or no changes made');
      }
      
      return {
        message: 'Track updated successfully',
        affectedRows: affectedRows
      };
    } catch (error) {
      throw new Error(`Error updating track: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await pool.connect();
      const request = pool.request();
      request.input('id', sql.Int, id);
      
      const query = 'DELETE FROM eshop.skladba WHERE id_skladby = @id; SELECT @@ROWCOUNT AS affectedRows;';
      const result = await request.query(query);
      const affectedRows = result.recordset[0].affectedRows;
      
      if (affectedRows === 0) {
        throw new Error('Track not found');
      }
      
      return {
        message: `Track with ID: ${id} deleted successfully`,
        affectedRows: affectedRows
      };
    } catch (error) {
      throw new Error(`Error deleting track: ${error.message}`);
    }
  }
}

module.exports = new TrackDAO();