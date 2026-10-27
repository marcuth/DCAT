let spinePlayer;

const removeDragonSelection = () => {
    document.querySelector('.FileInput')?.remove();
};

const buildPlayerConfig = (dragonName, response) => {
    const config = {
        skelUrl: `../files/extracted/${dragonName}.zip/${dragonName}.skel`,
        atlasUrl: `../files/extracted/${dragonName}.zip/${dragonName}.atlas`,
        viewport: {
            x: 0,
            y: 0,
            width: 350,
            height: 200,
            padLeft: "35%"
        },
        rawDataURIs: {
            ...response.data
        },
        premultipliedAlpha: false,
        showControls: false
    };

    if(dragonName.includes('fatality')){
        config.viewport = {};
    }

    if(appState.isTransparentBackground){
        config.alpha = true;
        config.backgroundColor = '#00000000';
    }
    else if(appState.backgroundImageName){
        config.alpha = true;
        config.backgroundColor = '#00000000';

        config.backgroundImage = {
            url: `../files/backgrounds/${appState.backgroundImageName.replace(/"/g, '')}`
        };
    }
    else{
        config.backgroundColor = appState.canvasBackgroundColor;
    }

    return config;
};

const setupPlayer = (dragonName, response) => {
    removeDragonSelection();

    spinePlayer = new spine.SpinePlayer("SpinePlayer__canvas_container", buildPlayerConfig(dragonName, response));

    setupPlayerControls(spinePlayer, dragonName.includes('fatality'));
};

const requestAnimationData = (dragonName) => {
    const name = dragonName.replace(/"/g, '');

    api.getAnimationDataUri(name).then(response => {
        if(response.data.pngExists){
            setupPlayer(name, response);
        }
        else{
            setTimeout(() => requestAnimationData(name), 100);
        }
    });
};

const loadDragonAfterExtraction = (zipFilename, message) => {
    alert(message);

    setTimeout(() => {
        removeDragonSelection();
        document.querySelector('.Home__help_button')?.remove();

        requestAnimationData(zipFilename.replace('.zip', ''));
    }, 450);
};
