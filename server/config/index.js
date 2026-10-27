require('dotenv').config({ quiet: true });

const DDS_CONVERTER_PROVIDERS = ['@marcuth/dds-to-png', 'convertio'];

const ddsConverterProvider = process.env.DDS_CONVERTER_PROVIDER || '@marcuth/dds-to-png';
const convertioApiKey = process.env.CONVERTIO_API_KEY;

if(!DDS_CONVERTER_PROVIDERS.includes(ddsConverterProvider)){
	throw new Error(`Invalid DDS_CONVERTER_PROVIDER "${ddsConverterProvider}". Use one of: ${DDS_CONVERTER_PROVIDERS.join(', ')}`);
}

if(ddsConverterProvider === 'convertio' && !convertioApiKey){
	throw new Error('CONVERTIO_API_KEY is required when DDS_CONVERTER_PROVIDER is "convertio"');
}

module.exports = {
	ddsConverterProvider,
	convertioApiKey,
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
