const fs = require('fs');
const { filesDir, pngMinAgeSeconds } = require('../config');
const { getSecondsSinceCreation } = require('../utils/file-age');

const getExtractedFilePath = (name, extension) => {
	return `${filesDir}/extracted/${name}.zip/${name}.${extension}`;
};

const isPngReady = (name) => {
	const pngPath = getExtractedFilePath(name, 'png');

	if(!fs.existsSync(pngPath)) return false;

	return getSecondsSinceCreation(fs.statSync(pngPath)) >= pngMinAgeSeconds;
};

module.exports = { getExtractedFilePath, isPngReady };
