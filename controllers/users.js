const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

module.exports.registerForm = (req, res) => {
	res.render('users/register');
};

module.exports.register = catchAsync(async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', `Weclome to YelpCamp, ${req.user.username}!`);
			res.redirect('/campgrounds');
		});
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('/register');
	}
});

module.exports.loginForm = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	req.flash('success', `Welcome back ${req.user.username}!`);
	const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
	const userName = req.user.username;
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash('success', `Goodbye	${userName}!`);
		res.redirect('/campgrounds');
	});
};
