import app from "./server";

const validateRequest = (req, res, next) => {
    const { data, file_b64 } = req.body;
  
    // Check if data is present and is an array
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: 'Invalid input: data must be an array'
      });
    }
  
    // Optional: Additional specific validations
    const invalidItems = data.filter(item => 
      typeof item !== 'string' || 
      item.length > 10  // Example: Prevent extremely long inputs
    );
  
    if (invalidItems.length > 0) {
      return res.status(400).json({
        is_success: false,
        error: 'Invalid items in input array',
        invalidItems
      });
    }
  
    // Optional file validation
    if (file_b64 && typeof file_b64 !== 'string') {
      return res.status(400).json({
        is_success: false,
        error: 'Invalid file format'
      });
    }
  
    next();
  };
  
  // Use middleware in your routes
  app.post('/bfhl', validateRequest, (req, res) => {
    // Existing route handler
  });