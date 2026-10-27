const fs = require('fs');
const { filesDir, logFilePath } = require('../config');
const { getExtractedFilePath, isPngReady } = require('../services/png-service');
const { getDisplayNames } = require('../services/dragon-display-name-service');
const { getBase64FromFile } = require('../utils/data-uri');
const { removeQuotes } = require('../utils/sanitize-name');

const log = require('../../data/log.json');

const getAnimationDataUri = (req, res) => {
	const name = removeQuotes(req.body.name);

	if(!isPngReady(name)){
		return res.status(200).send({ pngExists: false });
	}

	const skeletonBase64 = getBase64FromFile(getExtractedFilePath(name, 'skel'));
	const atlasBase64 = getBase64FromFile(getExtractedFilePath(name, 'atlas'));
	const pngBase64 = getBase64FromFile(getExtractedFilePath(name, 'png'));

	log.push(name);
	fs.writeFileSync(logFilePath, JSON.stringify(log, null, 3));

	res.status(200).send({
		pngExists: true,
		[`${name}.skel`]: 'data:application/octet-stream;base64,' + skeletonBase64,
		[`${name}.atlas`]: 'data:application/octet-stream;base64,' + atlasBase64,
		[`${name}.png`]: 'data:image/png;base64,' + pngBase64
	});
};

const checkPngExists = (req, res) => {
	const name = removeQuotes(req.body.name);

	res.status(200).send({ pngExists: isPngReady(name) });
};

const listZips = async (req, res) => {
	const zips = fs.readdirSync(`${filesDir}/list-zips`);
	const displayNames = await getDisplayNames(zips);

	res.status(200).send({ displayNames });
};

module.exports = { getAnimationDataUri, checkPngExists, listZips };
