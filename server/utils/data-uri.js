const fs = require('fs');

const getBase64FromFile = (path) => {
	return fs.readFileSync(path, { encoding: 'base64' });
};

const getBase64FromDataUri = (dataUri) => {
	return String(dataUri).split(';base64,')[1];
};

module.exports = { getBase64FromFile, getBase64FromDataUri };
