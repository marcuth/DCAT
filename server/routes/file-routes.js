const { Router } = require('express');
const controller = require('../controllers/file-controller');

const router = Router();

router.post('/copy-to-public', controller.copyToPublic);
router.post('/upload-background', controller.uploadBackground);
router.post('/upload-zip-file', controller.uploadZipFile);
router.post('/extract-file', controller.extractFile);

module.exports = router;
