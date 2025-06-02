var gcp = require('../controllers/gcp.server.controller.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

  module.exports = function(app) {
      app.route('/gcp/index').get(gcp.getIndex);
      app.post('/gcp/sendFile',upload.single('file'),gcp.uploadandprocess);
  };