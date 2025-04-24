// services/trackService.js
const trackDAO = require('../data/trackDAO');

class TrackService {
  async createTrack(trackData) {
    try {
      // Kontrola, či skladba už neexistuje s rovnakým názvom a interpretom
      const existingTracks = await trackDAO.findByNameAndArtist(
        trackData.nazov, 
        trackData.interpret_meno, 
        trackData.interpret_priezvisko
      );
      
      if (existingTracks && existingTracks.length > 0) {
        throw new Error('Skladba s týmto názvom a interpretom už existuje');
      }
      
      // Kontrola platnosti dostupnosti
      if (trackData.dostupnost && !['Dostupná', 'Nedostupná'].includes(trackData.dostupnost)) {
        trackData.dostupnost = 'Dostupná'; // Predvolená hodnota ak je neplatná
      }
      
      // Vytvorenie skladby v databáze
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
  
  async updateTrack(id, trackData) {
    try {
      // Kontrola, či skladba existuje
      const track = await trackDAO.findById(id);
      if (!track) {
        throw new Error('Track not found');
      }
      
      // Kontrola platnosti dostupnosti
      if (trackData.dostupnost && !['Dostupná', 'Nedostupná'].includes(trackData.dostupnost)) {
        trackData.dostupnost = track.dostupnost; // Ponechanie pôvodnej hodnoty
      }
      
      // Aktualizácia skladby
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