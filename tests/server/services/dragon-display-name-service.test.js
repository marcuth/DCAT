import { describe, it, expect } from 'vitest';
import { getDisplayName } from '../../../server/services/dragon-display-name-service';

const localization = {
	getDragonName: (id) => ({ en: `Dragon ${id}` }),
	getValueFromKey: (key) => ({ en: `Skin(${key})` })
};

describe('getDisplayName', () => {
	it('names vortex files', () => {
		expect(getDisplayName('basic_fire_vortex_HD.zip', localization)).toBe('fire Vortex');
	});

	it('names the high corrupted time dragon forms', () => {
		expect(getDisplayName('basic_2901_dragon_highcorruptedtime_b_1_HD.zip', localization))
			.toBe('High Corrupted Time Dragon (Baby form, black aura)');
		expect(getDisplayName('basic_2901_dragon_highcorruptedtime_b_3_HD.zip', localization))
			.toBe('High Corrupted Time Dragon (Adult form, black aura)');
	});

	it.each([
		['basic_2725_dragon_polargeneral_1_HD_spine.zip', 'Dragon 2725 (Baby form)'],
		['basic_2725_dragon_polargeneral_2_HD_spine.zip', 'Dragon 2725 (Young form)'],
		['basic_2725_dragon_polargeneral_3_HD_spine.zip', 'Dragon 2725 (Adult form)']
	])('names dragon %s', (zip, expected) => {
		expect(getDisplayName(zip, localization)).toBe(expected);
	});

	it('names skins using the skin localization key', () => {
		expect(getDisplayName('basic_2725_dragon_skin1_3_HD.zip', localization))
			.toBe('Dragon 2725 ("Skin(tid_unit_2725_3_name)" Skin, Adult form)');
	});

	it('names fatality skills', () => {
		expect(getDisplayName('basic_fx_3110_fatality_effect_HD_spine-3-8-59_dxt5.zip', localization))
			.toBe("Dragon 3110's fatality skill");
	});

	it('falls back to the zip name', () => {
		expect(getDisplayName('something_else.zip', localization)).toBe('something_else.zip');
	});
});
