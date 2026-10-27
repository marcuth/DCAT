const app = require('./app');
const fs = require('fs');
const { port, filesDir, temporaryDirs } = require('./config');
const { startCleanupScheduler } = require('./services/cleanup-service');

temporaryDirs.forEach(dir => fs.mkdirSync(`${filesDir}/${dir}`, { recursive: true }));

startCleanupScheduler();

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});

module.exports = app;
