// controllers/trackController.js
const trackService = require('../services/trackService');

class TrackController {
  async create(req, res) {
    try {
      const result = await trackService.createTrack(req.body);
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
      const tracks = await trackService.getAllTracks();
      res.status(200).json({
        status: 'success',
        data: tracks
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
      const track = await trackService.getTrackById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: track
      });
    } catch (error) {
      res.status(error.message === 'Track not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const result = await trackService.updateTrack(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(error.message === 'Track not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
  
  async delete(req, res) {
    try {
      const result = await trackService.deleteTrack(req.params.id);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(error.message === 'Track not found' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new TrackController();