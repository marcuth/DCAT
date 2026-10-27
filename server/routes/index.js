const { Router } = require('express');
const animationRoutes = require('./animation-routes');
const fileRoutes = require('./file-routes');

const router = Router();

router.use(animationRoutes);
router.use(fileRoutes);

module.exports = router;
