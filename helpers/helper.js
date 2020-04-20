const hbs = require('hbs');

hbs.registerHelper('pickPicture', function (arr, index) {
	return arr[index].url;
});
