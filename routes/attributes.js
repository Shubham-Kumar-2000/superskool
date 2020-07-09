const express = require('express');
const router = express.Router();
const attribute = require('../controllers/attributes');


router.get('/',attribute.getAll)
router.post("/add", attribute.add);
router.post("/delete", attribute.del);
router.get('/domains',attribute.domains)
router.post('/getAttributesByDomain',attribute.getAttributesByDomain)
module.exports = router;
