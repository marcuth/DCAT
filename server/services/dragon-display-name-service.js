const { Localization } = require("@dchighs/dc-localization");

const getFirstValue = (object) => object[Object.keys(object)[0]];

const getDisplayName = (zip, localization) => {
	if(zip.includes('vortex')){
		const vortexName = zip.split('_vortex')[0].split('basic_')[1];

		return `${vortexName} Vortex`;
	}

	if(zip.startsWith('basic_2901_dragon_highcorruptedtime_b_')){
		const form = zip.includes('_1_') ? 'Baby form' : 'Adult form';

		return `High Corrupted Time Dragon (${form}, black aura)`;
	}

	if(zip.includes('_dragon')){
		const id = Number(zip.split('basic_')[1].split('_dragon')[0]);
		const dragonName = localization.getDragonName(id);
		const form = zip.includes('_3_HD') ? '(Adult form)' :
		zip.includes('_2_HD') ? '(Young form)' : '(Baby form)';

		if(zip.includes('skin')){
			const skinNameKey = `tid_unit_${id}_${zip.split('_')[4]}_name`;
			const dragonSkinName = localization.getValueFromKey(skinNameKey);

			return `${getFirstValue(dragonName)} ("${getFirstValue(dragonSkinName)}" Skin, ${form.replace(/[\(\)]/g, '')})`;
		}

		return `${getFirstValue(dragonName)} ${form}`;
	}

	if(zip.includes('fatality')){
		// basic_fx_3110_fatality_effect_HD_spine-3-8-59_dxt5.zip
		const id = Number(zip.split('_fx_')[1].split('_fatality')[0]);
		const dragonName = localization.getDragonName(id);

		return `${getFirstValue(dragonName)}'s fatality skill`;
	}

	return zip;
};

const getDisplayNames = async (zips) => {
	const localization = await Localization.create("en");
	const displayNames = [];

	zips.forEach(zip => {
		try{
			displayNames.push({ zip, displayName: getDisplayName(zip, localization) });
		}
		catch{}
	});

	return displayNames;
};

module.exports = { getDisplayNames };
