const { Router } = require('express');
const controller = require('../controllers/animation-controller');

const router = Router();

router.post('/data-uri', controller.getAnimationDataUri);
router.post('/png-exists', controller.checkPngExists);
router.get('/list-zips', controller.listZips);

module.exports = router;
