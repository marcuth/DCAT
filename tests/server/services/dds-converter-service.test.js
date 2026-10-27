import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const configPath = require.resolve('../../../server/config');
const servicePath = require.resolve('../../../server/services/dds-converter-service');

const loadConfig = (env) => {
	delete require.cache[configPath];
	delete require.cache[servicePath];
	vi.stubEnv('DDS_CONVERTER_PROVIDER', env.provider ?? '');
	vi.stubEnv('CONVERTIO_API_KEY', env.key ?? '');

	return require('../../../server/config');
};

const jsonResponse = (body) => ({ ok: true, json: async () => body });

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

describe('config', () => {
	it('defaults to @marcuth/dds-to-png', () => {
		expect(loadConfig({}).ddsConverterProvider).toBe('@marcuth/dds-to-png');
	});

	it('rejects unknown providers', () => {
		expect(() => loadConfig({ provider: 'foo' })).toThrow(/Invalid DDS_CONVERTER_PROVIDER/);
	});

	it('requires an api key for convertio', () => {
		expect(() => loadConfig({ provider: 'convertio' })).toThrow(/CONVERTIO_API_KEY/);
	});
});

describe('convertio provider', () => {
	it('uploads, polls until finished and writes the downloaded png', async () => {
		loadConfig({ provider: 'convertio', key: 'secret' });
		const { convertDdsToPng } = require('../../../server/services/dds-converter-service');

		const fetchMock = vi.fn()
			.mockResolvedValueOnce(jsonResponse({ status: 'ok', data: { id: 'abc' } }))
			.mockResolvedValueOnce(jsonResponse({ status: 'ok', data: { step: 'finish' } }))
			.mockResolvedValueOnce(jsonResponse({ status: 'ok', data: { content: 'UE5H' } }));
		vi.stubGlobal('fetch', fetchMock);
		vi.spyOn(fs, 'readFileSync').mockReturnValue('RERT');
		const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

		await convertDdsToPng('in.dds', 'out.png');

		const uploadBody = JSON.parse(fetchMock.mock.calls[0][1].body);
		expect(fetchMock.mock.calls[0][0]).toBe('https://api.convertio.co/convert');
		expect(uploadBody).toMatchObject({ apikey: 'secret', input: 'base64', file: 'RERT', outputformat: 'png' });
		expect(fetchMock.mock.calls[1][0]).toBe('https://api.convertio.co/convert/abc/status');
		expect(fetchMock.mock.calls[2][0]).toBe('https://api.convertio.co/convert/abc/dl/base64');
		expect(writeSpy).toHaveBeenCalledWith('out.png', Buffer.from('PNG'));
	});

	it('throws when the api reports an error', async () => {
		loadConfig({ provider: 'convertio', key: 'bad' });
		const { convertDdsToPng } = require('../../../server/services/dds-converter-service');

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ status: 'error', error: 'Invalid API Key' })));
		vi.spyOn(fs, 'readFileSync').mockReturnValue('RERT');

		await expect(convertDdsToPng('in.dds', 'out.png')).rejects.toThrow('Convertio API error: Invalid API Key');
	});
});
