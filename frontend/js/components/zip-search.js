const dragonSearchInput = document.querySelector('.Help__dragonsearch');
const dragonDownloadList = document.querySelector('.Help__dragon_downloads_list');

const selectDragonZip = (dragon) => {
    api.copyToPublic(`public/files/list-zips/${dragon.zip}`, dragon.zip, 'zip').then(() => {
        closeHelpModalButton.click();

        api.extractFile(dragon.zip).then(response => {
            loadDragonAfterExtraction(dragon.zip, response.data.message);
        });
    });
};

const renderZipList = () => {
    const searchTerm = dragonSearchInput.value.toLowerCase();

    Array.from(dragonDownloadList.children).forEach(link => link.remove());

    appState.availableZips.forEach(dragon => {
        if(!dragon.zip.includes(searchTerm) && !dragon.displayName.toLowerCase().includes(searchTerm)) return;

        const link = document.createElement('a');
        link.innerHTML = dragon.displayName;
        link.addEventListener('click', () => selectDragonZip(dragon));

        dragonDownloadList.appendChild(link);
    });
};

dragonSearchInput.addEventListener('input', renderZipList);
