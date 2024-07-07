const express = require('express');
const router = express.Router();
const {
	index,
	newForm,
	create,
	show,
	editForm,
	edit,
	deleteCampground,
} = require('../controllers/campgrounds');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

router.route('/').get(index).post(isLoggedIn, upload.array('image'), validateCampground, create);

router.get('/new', isLoggedIn, newForm);
router
	.route('/:id')
	.get(show)
	.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, edit)
	.delete(isLoggedIn, isAuthor, deleteCampground);
router.get('/:id/edit', isLoggedIn, isAuthor, editForm);

module.exports = router;
