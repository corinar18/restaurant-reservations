const express = require('express');
const router = express.Router();

require('available-intervals')(router);
require('restaurants')(router);
require('reservations')(router);

module.exports = router;