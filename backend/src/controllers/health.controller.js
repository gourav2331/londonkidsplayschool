const config = require('../config');

const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    service: 'playschool-node-backend',
    env: config.env
  });
};

module.exports = {
  healthCheck
};
