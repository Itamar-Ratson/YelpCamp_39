const axios = require('axios');

async function seedImg() {
	try {
		const resp = await axios.get('https://api.unsplash.com/photos/random', {
			params: {
				client_id: 'e1cBzf4QgMdOFH-ivP7F2K-2cFbyKZ3qf9rYlYdLVDA',
				collections: 1114848,
			},
		});
		return resp.data.urls.small;
	} catch (err) {
		console.error(err);
	}
}

module.exports = seedImg;
