const app = require('./app');
const { port } = require('./config');
const { startCleanupScheduler } = require('./services/cleanup-service');

startCleanupScheduler();

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});

module.exports = app;
