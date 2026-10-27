const fs = require('fs');
const { filesDir, cleanupIntervalMs, cleanupMaxAgeSeconds } = require('../config');
const { getSecondsSinceCreation } = require('../utils/file-age');

const removeOldEntries = (directory, getReferenceFile) => {
	fs.readdirSync(directory).forEach(entry => {
		const stats = fs.statSync(getReferenceFile(directory, entry));

		if(getSecondsSinceCreation(stats) > cleanupMaxAgeSeconds){
			fs.rmSync(`${directory}/${entry}`, { recursive: true, force: true });
		}
	});
};

const cleanupTemporaryFiles = () => {
	const entryPath = (directory, entry) => `${directory}/${entry}`;

	removeOldEntries(`${filesDir}/backgrounds`, entryPath);
	removeOldEntries(`${filesDir}/zip`, entryPath);
	removeOldEntries(`${filesDir}/extracted`, (directory, entry) => `${directory}/${entry}/${entry.replace('.zip', '.dds')}`);
};

const startCleanupScheduler = () => {
	setInterval(cleanupTemporaryFiles, cleanupIntervalMs);
};

module.exports = { cleanupTemporaryFiles, startCleanupScheduler };
