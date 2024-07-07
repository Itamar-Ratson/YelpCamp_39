const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const { create, deleteReview } = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, create);
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;
