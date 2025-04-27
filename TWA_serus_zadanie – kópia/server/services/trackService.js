// services/trackService.js
const trackDAO = require('../data/trackDAO');
const producerDAO = require('../data/producerDAO');

class TrackService {
  async createTrack(trackData) {
    try {
      // Check if track already exists with same name and artist
      const existingTracks = await trackDAO.findByNameAndArtist(
        trackData.nazov, 
        trackData.interpret_meno, 
        trackData.interpret_priezvisko
      );
      
      if (existingTracks && existingTracks.length > 0) {
        throw new Error('Skladba s týmto názvom a interpretom už existuje');
      }
      
      // Validate availability
      if (trackData.dostupnost && !['Dostupná', 'Nedostupná'].includes(trackData.dostupnost)) {
        trackData.dostupnost = 'Dostupná'; // Default value if invalid
      }
      
      // If producer_id is provided, check if it exists
      if (trackData.id_producent) {
        const producer = await producerDAO.findById(trackData.id_producent);
        if (!producer) {
          throw new Error('Producer not found');
        }
      }
      
      // Create track in database
      return await trackDAO.create(trackData);
    } catch (error) {
      throw error;
    }
  }

  async getTrackByName(name) {
    try {
      return await trackDAO.findByName(name);
    } catch (error) {
      throw error;
    }
  }

  async findByNameAndArtist(name, firstName, lastName) {
    try {
      return await trackDAO.findByNameAndArtist(name, firstName, lastName);
    } catch (error) {    
      throw error;
    }
  }

  async getAllTracks() {
    try {
      return await trackDAO.findAll();
    } catch (error) {
      throw error;
    }
  }
  
  async getTrackById(id) {
    try {
      const track = await trackDAO.findById(id);
      
      if (!track) {
        throw new Error('Track not found');
      }
      
      return track;
    } catch (error) {
      throw error;
    }
  }

  async getTracksByProducerId(producerId) {
    try {
      const tracks = await trackDAO.findByProducerId(producerId);
      return tracks;
    } catch (error) {
      throw error;
    }
  }
  
  async updateTrack(id, trackData) {
    try {
      // Check if track exists
      const track = await trackDAO.findById(id);
      if (!track) {
        throw new Error('Track not found');
      }
      
      // Validate availability
      if (trackData.dostupnost && !['Dostupná', 'Nedostupná'].includes(trackData.dostupnost)) {
        trackData.dostupnost = track.dostupnost; // Keep original value
      }
      
      // If producer_id is provided, check if it exists
      if (trackData.id_producent) {
        const producer = await producerDAO.findById(trackData.id_producent);
        if (!producer) {
          throw new Error('Producer not found');
        }
      }
      
      // Update track
      return await trackDAO.update(id, trackData);
    } catch (error) {
      throw error;
    }
  }
  
  async deleteTrack(id) {
    try {
      return await trackDAO.delete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TrackService();