/*---- background color input ----- */

const backgroundColorInput = document.querySelector('#upload-background_color');

backgroundColorInput.addEventListener('change', () => {
    appState.canvasBackgroundColor = backgroundColorInput.value;
});

/*------ transparent background input ---- */

const transparentBackgroundInput = document.getElementById('alpha');
const transparentBackgroundIndicator = document.querySelector('.Home_transparent-background_input_clicked');
const transparentBackgroundInputContainer = document.querySelector('.Home__transparent-background_input_container');
const transparentBackgroundInputLabel = document.querySelector('.Home__transparent-background_input');

transparentBackgroundInputContainer.addEventListener('click', () => {
    transparentBackgroundInput.click();
});

transparentBackgroundInputLabel.addEventListener('click', (event) => {
    event.preventDefault();
});

transparentBackgroundInput.addEventListener('change', () => {
    appState.isTransparentBackground = transparentBackgroundInput.checked;

    transparentBackgroundIndicator.classList.toggle(
        'Home_transparent-background_input_clicked-click',
        appState.isTransparentBackground
    );
});

/*----- background image input -----*/

const backgroundImageInput = document.querySelector('#upload-background_image');

backgroundImageInput.addEventListener('change', () => {
    const reader = new FileReader();

    reader.readAsDataURL(backgroundImageInput.files[0]);

    reader.addEventListener('load', (event) => {
        const data = event.target.result;

        appState.backgroundImageName = 'BG-' + backgroundImageInput.files[0].name;

        api.uploadBackground(appState.backgroundImageName, data);
    });
});
