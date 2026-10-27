const getSecondsSinceCreation = (stats) => {
	return Math.trunc(
		Math.abs(
			new Date(Math.trunc(stats.birthtimeMs)) - Date.now()
		) / 1000
	);
};

module.exports = { getSecondsSinceCreation };
