import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import { getExtractedFilePath, isPngReady } from '../../../server/services/png-service';

afterEach(() => vi.restoreAllMocks());

describe('getExtractedFilePath', () => {
	it('builds the path inside the extracted zip folder', () => {
		expect(getExtractedFilePath('dragon', 'png')).toBe('public/files/extracted/dragon.zip/dragon.png');
	});
});

describe('isPngReady', () => {
	it('is false when the png does not exist', () => {
		vi.spyOn(fs, 'existsSync').mockReturnValue(false);

		expect(isPngReady('dragon')).toBe(false);
	});

	it('is false while the png is younger than 6 seconds', () => {
		vi.spyOn(Date, 'now').mockReturnValue(100_000);
		vi.spyOn(fs, 'existsSync').mockReturnValue(true);
		vi.spyOn(fs, 'statSync').mockReturnValue({ birthtimeMs: 97_000 });

		expect(isPngReady('dragon')).toBe(false);
	});

	it('is true once the png is at least 6 seconds old', () => {
		vi.spyOn(Date, 'now').mockReturnValue(100_000);
		vi.spyOn(fs, 'existsSync').mockReturnValue(true);
		vi.spyOn(fs, 'statSync').mockReturnValue({ birthtimeMs: 94_000 });

		expect(isPngReady('dragon')).toBe(true);
	});
});
