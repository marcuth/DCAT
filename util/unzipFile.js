const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { convertDdsToPng } = require('@marcuth/dds-to-png');

const unzipFile = (filename) => {
	if(!filename.endsWith('.zip')){
		return 'File doesnt exist';
	}

    try{
        let zip = new AdmZip(`public/files/zip/${filename}`);
        // fs.mkdirSync(`files/extracted/${filename}`);
        zip.extractAllTo(`public/files/extracted/${filename}/`, true);
    
        let atlasContents = fs.readFileSync(`public/files/extracted/${filename}/${filename.replace('.zip', '.atlas')}`, 'utf-8');
        fs.writeFileSync(`public/files/extracted/${filename}/${filename.replace('.zip', '.atlas')}`, atlasContents.replace('.dds', '.png'));

        axios.post('http://localhost:7272/pngexists', { name: filename.replace('.zip', '') }).then(res => {
            if(res.data.pngExists) return;
            else{
                const ddsFileName = `${filename.replace('.zip', '.dds')}`;
                const ddsFilePath = path.resolve('public/files/extracted', filename, ddsFileName);
                const pngFileName = `${filename.replace('.zip', '.png')}`;
                const pngFilePath = path.resolve('public/files/extracted', filename, pngFileName);

                console.log('converting dds to png for ' + filename)
                convertDdsToPng(ddsFilePath, pngFilePath).then(() => {
                    fs.unlinkSync(ddsFilePath);
                });
            }
        });
    }
    catch{}
};

module.exports = { unzipFile };