module.exports = {
	port: 7272,
	frontendDir: './frontend',
	publicDir: 'public',
	logsDir: 'logs',
	filesDir: 'public/files',
	temporaryDirs: ['zip', 'extracted', 'backgrounds'],
	cleanupIntervalMs: 480000,
	cleanupMaxAgeSeconds: 25,
	pngMinAgeSeconds: 6
};
