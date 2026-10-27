const zipFileInput = document.querySelector('#upload-zip');
const zipFileInputLabelContainer = document.querySelector('.FileInput__upload-zip_label_container');
const zipFileInputLabel = document.querySelector('.FileInput__upload-zip_label');

zipFileInputLabel.addEventListener('click', (event) => {
    event.preventDefault();
});

zipFileInputLabelContainer.addEventListener('click', () => {
    zipFileInput.click();
});

zipFileInput.addEventListener('change', () => {
    const reader = new FileReader();
    reader.readAsDataURL(zipFileInput.files[0]);

    reader.addEventListener('load', (event) => {
        const data = event.target.result;
        const filename = zipFileInput.files[0].name;

        api.uploadZipFile(filename, data).then(response => {
            loadDragonAfterExtraction(filename, response.data.message);
        });
    });
});
