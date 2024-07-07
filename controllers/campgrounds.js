const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

// index all camps
module.exports.index = catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});

// new camp page
module.exports.newForm = catchAsync((req, res) => {
	res.render('campgrounds/new');
});

// create new camp
module.exports.create = catchAsync(async (req, res) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	const campground = new Campground(req.body.campground);
	campground.geometry = geoData.body.features[0].geometry;
	campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.author = req.user._id;
	await campground.save();
	console.log(campground);
	req.flash('success', 'Successfully made a new campground');
	res.redirect(`/campgrounds/${campground._id}`);
});

// show a camp
module.exports.show = catchAsync(async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id)
		.populate({
			path: 'reviews',
			populate: 'author',
		})
		.populate('author');
	if (!campground) {
		req.flash('error', 'Cannot find that campground');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
});

// edit camp page
module.exports.editForm = catchAsync(async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash('error', 'Cannot find that campground');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
});

// edit camp
module.exports.edit = catchAsync(async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	await campground.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
	}
	req.flash('success', 'Successfully updated campground');
	res.redirect(`/campgrounds/${id}`);
});

// delete camp
module.exports.deleteCampground = catchAsync(async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted the campground');
	res.redirect('/campgrounds');
});
