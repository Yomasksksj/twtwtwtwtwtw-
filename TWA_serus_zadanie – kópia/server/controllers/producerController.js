// controllers/producerController.js
const producerService = require('../services/producerService');
const trackService = require('../services/trackService');

class ProducerController {
  async create(req, res) {
    try {
      const result = await producerService.createProducer(req.body);
      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  
  async getAll(req, res) {
    try {
      const producers = await producerService.getAllProducers();
      res.status(200).json({
        status: 'success',
        data: producers
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
      const producer = await producerService.getProducerById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: producer
      });
    } catch (error) {
      res.status(error.message === 'Producer not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  async getByName(req, res) {
    try {
      const producer = await producerService.getProducerByName(req.params.name);
      res.status(200).json({
        status: 'success',
        data: producer
      });
    } catch (error) {
      res.status(error.message === 'Producer not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  
  async update(req, res) {
    try {
      const result = await producerService.updateProducer(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(error.message === 'Producer not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  
  async delete(req, res) {
    try {
      const result = await producerService.deleteProducer(req.params.id);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(error.message === 'Producer not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  async getTracks(req, res) {
    try {
      // First verify producer exists
      await producerService.getProducerById(req.params.id);
      
      // Get tracks for this producer
      const tracks = await trackService.getTracksByProducerId(req.params.id);
      res.status(200).json({
        status: 'success',
        data: tracks
      });
    } catch (error) {
      res.status(error.message === 'Producer not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new ProducerController();  