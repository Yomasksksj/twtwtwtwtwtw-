// services/producerService.js
const producerDAO = require('../data/producerDAO');

class ProducerService {
  async createProducer(producerData) {
    try {
      return await producerDAO.create(producerData);
    } catch (error) {
      throw error;
    }
  }
  
  async getAllProducers() {
    try {
      return await producerDAO.findAll();
    } catch (error) {
      throw error;
    }
  }
  
  async getProducerById(id) {
    try {
      const producer = await producerDAO.findById(id);
      
      if (!producer) {
        throw new Error('Producer not found');
      }
      
      return producer;
    } catch (error) {
      throw error;
    }
  }
  
  async updateProducer(id, producerData) {
    try {
      // Check if producer exists
      const producer = await producerDAO.findById(id);
      if (!producer) {
        throw new Error('Producer not found');
      }
      
      // Update producer
      return await producerDAO.update(id, producerData);
    } catch (error) {
      throw error;
    }
  }
  
  async deleteProducer(id) {
    try {
      return await producerDAO.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async getProducerByName(name) {
    try {
      const producer = await producerDAO.findByName(name);
      if (!producer || producer.length === 0) {
        throw new Error('Producer not found');
      }
      return producer;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProducerService();