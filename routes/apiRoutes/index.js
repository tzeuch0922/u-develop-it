const express = require('express');
const router = express.Router();

router.use(require('./candidateRoutes.js'));
router.use(require('./partyRoutes.js'));
router.use(require('./voterRoutes.js'));
router.use(require('./voteRoutes.js'));

module.exports = router;