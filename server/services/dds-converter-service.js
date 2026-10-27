const fs = require('fs');
const { ddsConverterProvider, convertioApiKey } = require('../config');

const CONVERTIO_API_URL = 'https://api.convertio.co';
const CONVERTIO_POLL_INTERVAL_MS = 1000;
const CONVERTIO_TIMEOUT_MS = 120000;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const requestConvertio = async (endpoint, options) => {
	const response = await fetch(`${CONVERTIO_API_URL}${endpoint}`, options);
	const body = await response.json();

	if(body.status !== 'ok'){
		throw new Error(`Convertio API error: ${body.error || response.statusText}`);
	}

	return body.data;
};

const convertWithConvertio = async (ddsPath, pngPath) => {
	const { id } = await requestConvertio('/convert', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			apikey: convertioApiKey,
			input: 'base64',
			file: fs.readFileSync(ddsPath, { encoding: 'base64' }),
			filename: 'texture.dds',
			outputformat: 'png'
		})
	});

	const deadline = Date.now() + CONVERTIO_TIMEOUT_MS;

	while(true){
		const { step } = await requestConvertio(`/convert/${id}/status`);

		if(step === 'finish') break;
		if(Date.now() > deadline) throw new Error('Convertio conversion timed out');

		await wait(CONVERTIO_POLL_INTERVAL_MS);
	}

	const { content } = await requestConvertio(`/convert/${id}/dl/base64`);

	fs.writeFileSync(pngPath, Buffer.from(content, 'base64'));
};

const convertWithMarcuth = (ddsPath, pngPath) => {
	const { convertDdsToPng } = require('@marcuth/dds-to-png');

	return convertDdsToPng(ddsPath, pngPath);
};

const providers = {
	'convertio': convertWithConvertio,
	'@marcuth/dds-to-png': convertWithMarcuth
};

const convertDdsToPng = (ddsPath, pngPath) => providers[ddsConverterProvider](ddsPath, pngPath);

module.exports = { convertDdsToPng };
