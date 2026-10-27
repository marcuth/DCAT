const backgroundListContainer = document.querySelector('#background-list-container');
const backgroundList = document.querySelector('#background-list');
const openBackgroundListButton = document.querySelector('#open-background-list');
const closeBackgroundListButton = document.querySelector('.Home__background-list_close');

const defaultBackgroundItems = document.querySelectorAll('.Background-image__list_item');

defaultBackgroundItems.forEach(item => {
    item.addEventListener('click', () => {
        const image = item.querySelector('img');
        const filename = image.src.split('default-backgrounds/')[1];

        api.copyToPublic(`public/files/default-backgrounds/${filename}`, filename, 'backgrounds').then(() => {
            appState.backgroundImageName = filename;
            closeBackgroundListButton.click();
        });
    });
});

openBackgroundListButton.addEventListener('click', () => {
    backgroundListContainer.classList.add('Home__background-image_list_container');
    backgroundListContainer.classList.remove('Home__background-image_list_container_hidden');

    backgroundList.classList.add('Home__background-image_list');
    backgroundList.classList.remove('Home__background-image_list_hidden');
});

closeBackgroundListButton.addEventListener('click', () => {
    backgroundListContainer.classList.remove('Home__background-image_list_container');
    backgroundListContainer.classList.add('Home__background-image_list_container_hidden');

    backgroundList.classList.remove('Home__background-image_list');
    backgroundList.classList.add('Home__background-image_list_hidden');
});
