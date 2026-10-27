import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import { getSecondsSinceCreation } from '../../../server/utils/file-age';
import { removeQuotes } from '../../../server/utils/sanitize-name';
import { getBase64FromFile, getBase64FromDataUri } from '../../../server/utils/data-uri';

afterEach(() => vi.restoreAllMocks());

describe('getSecondsSinceCreation', () => {
	it('returns the whole seconds elapsed since the file birth time', () => {
		vi.spyOn(Date, 'now').mockReturnValue(100_000);

		expect(getSecondsSinceCreation({ birthtimeMs: 90_500.7 })).toBe(9);
	});

	it('never returns a negative value', () => {
		vi.spyOn(Date, 'now').mockReturnValue(100_000);

		expect(getSecondsSinceCreation({ birthtimeMs: 110_000 })).toBe(10);
	});
});

describe('removeQuotes', () => {
	it('removes every double quote', () => {
		expect(removeQuotes('"dragon"_"1"')).toBe('dragon_1');
	});

	it('keeps names without quotes untouched', () => {
		expect(removeQuotes('dragon')).toBe('dragon');
	});
});

describe('data-uri helpers', () => {
	it('extracts the base64 payload from a data URI', () => {
		expect(getBase64FromDataUri('data:image/png;base64,QUJD')).toBe('QUJD');
	});

	it('reads a file as base64', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue('QUJD');

		expect(getBase64FromFile('any/path')).toBe('QUJD');
		expect(fs.readFileSync).toHaveBeenCalledWith('any/path', { encoding: 'base64' });
	});
});
