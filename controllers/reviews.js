const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

// post a review
module.exports.create = catchAsync(async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash('success', 'Made a new review');
	res.redirect(`/campgrounds/${id}`);
});

// delete a review
module.exports.deleteReview = catchAsync(async (req, res) => {
	const { id, reviewId } = req.params;
	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted the review');
	res.redirect(`/campgrounds/${id}`);
});
