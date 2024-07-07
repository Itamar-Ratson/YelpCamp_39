const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const { registerForm, register, loginForm, login, logout } = require('../controllers/users');

router.route('/register').get(registerForm).post(register);
router
	.route('/login')
	.get(loginForm)
	.post(
		storeReturnTo, // use the storeReturnTo middleware to save the returnTo value from session to res.locals
		passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), // passport.authenticate logs the user in and clears req.session
		login // Now we can use res.locals.returnTo to redirect the user after login
	);
router.get('/logout', logout);

module.exports = router;
