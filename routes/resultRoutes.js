const { Router } = require('express');
const resultController = require('../controllers/resultController');
const { requireAuth, checkAuthor } = require('../middleware/authMiddleware');

const router = Router();

router.get('/:testId/:resultId', resultController.getResultById);
router.post('/', resultController.postResult)

module.exports = router;