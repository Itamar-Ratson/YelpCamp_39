// setting mongoose and others
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const seedImg = require('./images');
const Campground = require('../models/campground');
const images = require('./images');
const dbUrl = process.env.DB_URL;

// enabling mongoose and express
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected from seeds');
});

// randomly pick an element in an array
const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const price = Math.floor(Math.random() * 20) + 10;
		// setup
		const placeSeed = Math.floor(Math.random() * places.length);
		const descriptorsSeed = Math.floor(Math.random() * descriptors.length);
		const citySeed = Math.floor(Math.random() * cities.length);

		// seed data into campground
		const camp = new Campground({
			author: '66803520567a695dd7b8207c',
			geometry: {
				type: 'Point',
				coordinates: [cities[citySeed].longitude, cities[citySeed].latitude],
			},
			images: [
				{
					url: 'https://res.cloudinary.com/dutknkusl/image/upload/v1720307942/YelpCamp/eftcjapvprf4qjyt52um.jpg',
					filename: 'YelpCamp/eftcjapvprf4qjyt52um',
				},
				{
					url: 'https://res.cloudinary.com/dutknkusl/image/upload/v1720115574/YelpCamp/aa6ls6vlbaoiwko8m1uy.jpg',
					filename: 'YelpCamp/aa6ls6vlbaoiwko8m1uy',
				},
			],
			title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
			location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
			description:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
			price,
		});

		await camp.save();
	}
};

seedDB().then(() => mongoose.connection.close());
