const helpModalContainer = document.querySelector('#help_container');
const helpModal = document.querySelector('#help');
const closeHelpModalButton = document.querySelector('.Home__help_close');
const openHelpModalButton = document.querySelector('.Home__help_button');

const showHelpModal = () => {
    helpModalContainer.classList.remove('Home__help_container_hidden');
    helpModalContainer.classList.add('Home__help_container');

    setTimeout(() => {
        helpModal.classList.remove('Home__help_hidden');
        helpModal.classList.add('Home__help');

        renderZipList();
    }, 300);
};

closeHelpModalButton.addEventListener('click', () => {
    helpModal.classList.add('Home__help_hidden');
    helpModal.classList.remove('Home__help');

    helpModalContainer.classList.add('Home__help_container_hidden');
    helpModalContainer.classList.remove('Home__help_container');
});

openHelpModalButton.addEventListener('click', () => {
    if(appState.availableZips.length > 0){
        return showHelpModal();
    }

    api.listZips().then(response => {
        appState.availableZips = response.data.displayNames;
        showHelpModal();
    });
});
