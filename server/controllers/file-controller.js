const fs = require('fs');
const { filesDir } = require('../config');
const { unzipFile } = require('../utils/unzip-file');
const { getBase64FromDataUri } = require('../utils/data-uri');

const EXTRACTING_MESSAGE = 'Extracting/Converting files and loading player, please wait...';

const copyToPublic = (req, res) => {
	const { path: originalPath, filename, type } = req.body;
	const newPath = `${filesDir}/${type}/${filename}`;

	fs.copyFileSync(originalPath, newPath);

	res.status(200).json({ newPath });
};

const uploadBackground = (req, res) => {
	const buffer = Buffer.from(getBase64FromDataUri(req.body.data), 'base64');
	fs.writeFileSync(`${filesDir}/backgrounds/${req.body.filename}`, buffer);

	res.status(200).send({ message: 'OK' });
};

const uploadZipFile = (req, res) => {
	const filename = req.body.filename.replace(' ', '');
	const buffer = Buffer.from(getBase64FromDataUri(req.body.data), 'base64');
	fs.writeFileSync(`${filesDir}/zip/${filename}`, buffer);

	unzipFile(filename);

	res.status(200).send({ message: EXTRACTING_MESSAGE });
};

const extractFile = (req, res) => {
	unzipFile(req.body.filename);

	res.status(200).send({ message: EXTRACTING_MESSAGE });
};

module.exports = { copyToPublic, uploadBackground, uploadZipFile, extractFile };
