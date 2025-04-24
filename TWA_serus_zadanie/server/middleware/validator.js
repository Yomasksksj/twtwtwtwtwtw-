// middleware/validator.js
function validate(validator) {
    return (req, res, next) => {
      const valid = validator(req.body);
      
      if (!valid) {
        const errors = validator.errors.map(error => {
          return {
            field: error.instancePath.replace('/', ''),
            message: error.message
          };
        });
        
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors
        });
      }
      
      next();
    };
  }
  
  module.exports = validate;