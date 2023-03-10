const { Router } = require('express');
const testController = require('../controllers/testController');
const { requireAuth, checkAuthor } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', requireAuth, testController.getTests);
router.get('/new', requireAuth, testController.getNewTest);
router.post('/new', requireAuth, testController.postTest);
router.post('/', requireAuth, testController.postTest);
router.delete('/:testId', requireAuth, testController.deleteTest);
router.get('/:testId', checkAuthor, testController.getTestById);
router.get('/:testId/edit', checkAuthor, testController.getTestByIdAndEdit);
router.put('/:testId', requireAuth, checkAuthor, testController.updateTestById);
router.get('/:testId/maps', checkAuthor, testController.getMapsByTestId);
/* router.post(':testId/results', resultController) */

router.get('/:testId/results', testController.getTestForResult);

module.exports = router;