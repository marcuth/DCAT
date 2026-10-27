import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import request from 'supertest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = require('../../../server/app');

afterEach(() => vi.restoreAllMocks());

describe('POST /png-exists', () => {
	it('reports false when the png is missing', async () => {
		vi.spyOn(fs, 'existsSync').mockReturnValue(false);

		const response = await request(app).post('/png-exists').send({ name: '"dragon"' });

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ pngExists: false });
		expect(fs.existsSync).toHaveBeenCalledWith('public/files/extracted/dragon.zip/dragon.png');
	});
});

describe('POST /data-uri', () => {
	it('returns pngExists false when the png is not ready', async () => {
		vi.spyOn(fs, 'existsSync').mockReturnValue(false);

		const response = await request(app).post('/data-uri').send({ name: 'dragon' });

		expect(response.body).toEqual({ pngExists: false });
	});

	it('returns the skeleton, atlas and png as data URIs when ready', async () => {
		vi.spyOn(fs, 'existsSync').mockReturnValue(true);
		vi.spyOn(fs, 'statSync').mockReturnValue({ birthtimeMs: 0 });
		vi.spyOn(fs, 'readFileSync').mockReturnValue('QUJD');

		const response = await request(app).post('/data-uri').send({ name: 'dragon' });

		expect(response.body).toEqual({
			pngExists: true,
			'dragon.skel': 'data:application/octet-stream;base64,QUJD',
			'dragon.atlas': 'data:application/octet-stream;base64,QUJD',
			'dragon.png': 'data:image/png;base64,QUJD'
		});
	});
});

describe('POST /copy-to-public', () => {
	it('copies the file and returns its new path', async () => {
		const copySpy = vi.spyOn(fs, 'copyFileSync').mockImplementation(() => {});

		const response = await request(app)
			.post('/copy-to-public')
			.send({ path: 'public/files/list-zips/a.zip', filename: 'a.zip', type: 'zip' });

		expect(copySpy).toHaveBeenCalledWith('public/files/list-zips/a.zip', 'public/files/zip/a.zip');
		expect(response.body).toEqual({ newPath: 'public/files/zip/a.zip' });
	});
});

describe('POST /upload-background', () => {
	it('decodes the data URI and saves it as a background', async () => {
		const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

		const response = await request(app)
			.post('/upload-background')
			.send({ filename: 'BG-a.png', data: 'data:image/png;base64,QUJD' });

		expect(writeSpy).toHaveBeenCalledWith('public/files/backgrounds/BG-a.png', Buffer.from('ABC'));
		expect(response.body).toEqual({ message: 'OK' });
	});
});

describe('POST /extract-file', () => {
	it('answers with the extraction message', async () => {
		const response = await request(app).post('/extract-file').send({ filename: 'not-a-zip.txt' });

		expect(response.status).toBe(200);
		expect(response.body.message).toMatch(/Extracting/);
	});
});

describe('GET /list-zips', () => {
	it('lists zips with their display names', async () => {
		vi.spyOn(fs, 'readdirSync').mockReturnValue(['plain.zip']);

		const response = await request(app).get('/list-zips');

		expect(response.status).toBe(200);
		expect(response.body.displayNames).toEqual([{ zip: 'plain.zip', displayName: 'plain.zip' }]);
	});
});
