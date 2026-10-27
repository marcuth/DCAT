let animationNames = [];
let animationIndex = 0;

const createElement = (tag, className, properties = {}) => {
    const element = document.createElement(tag);

    if(className) element.classList.add(className);

    return Object.assign(element, properties);
};

const openViewportSettings = (player, applyAndRestartAnimation) => {
    const optionsContainer = createElement('div', 'viewport-settings__container');
    const settings = createElement('div', 'viewport-settings');

    settings.innerHTML = `
        <p class="viewport-settings_close">X</p>

        <div class="viewport-settings__pad_container">
            <input type="number" id="padleft" min="0" max="200" value="${player.config.viewport.padLeft?.replace('%', '') || '30'}" />
            <label for="padleft">Left padding (in %)</label>
        </div>

        <div class="viewport-settings__pad_container">
            <input type="number" id="padtop" min="0" max="200" value="${player.config.viewport.padTop?.replace('%', '') || '0'}" />
            <label for="padtop">Top padding (in %)</label>
        </div>

        <button class="viewport-settings__apply_button">Apply changes</button>
    `;

    optionsContainer.append(settings);

    const padLeftInput = settings.querySelector('#padleft');
    const padTopInput = settings.querySelector('#padtop');
    const applyChangesButton = settings.querySelector('.viewport-settings__apply_button');
    const closeButton = settings.querySelector('.viewport-settings_close');

    closeButton.addEventListener('click', () => optionsContainer.remove());

    applyChangesButton.addEventListener('click', () => {
        player.config.viewport = {
            ...player.config.viewport,
            padLeft: `${padLeftInput.value}%`,
            padTop: `${padTopInput.value}%`
        };

        applyAndRestartAnimation();
        alert('Successfully applied viewport changes');
        closeButton.click();
    });

    document.querySelector('#Home').append(optionsContainer);
};

const recordPlayerAnimation = (timeInMs) => {
    const canvas = document.querySelector('.spine-player-canvas');
    const recording = recordCanvas(canvas, timeInMs);

    const downloadLink = createElement('a', 'Home__output_video_link');

    downloadLink.addEventListener('click', () => {
        setTimeout(() => downloadLink.remove(), 650);
    });

    recording.then((url) => {
        document.querySelector('.SpinePlayer__container').append(downloadLink);
        downloadLink.setAttribute('download', 'output');
        downloadLink.setAttribute('href', url);
        downloadLink.innerHTML = 'Download output video';
        alert('Done recording your video, if you want to see/record more animations reload the page');
    });
};

const setupPlayerControls = (player, isEternalFatalitySkill) => {
    const prefix = 'SpinePlayer__canvas_container';

    const buttonsContainer = createElement('div', `${prefix}_buttons_container`);

    const changeAnimationContainer = createElement('div', `${prefix}_changeanim_container`);
    const changeAnimationButton = createElement('button', `${prefix}_changeanim_button`, { innerHTML: 'Change animation' });
    const changeAnimationLabel = createElement('label');

    const setScaleButton = createElement('button', `${prefix}_setscale_button`, { innerHTML: 'Set scale' });
    const startRecordingButton = createElement('button', `${prefix}_startrecording_button`, { innerHTML: 'Start recording' });
    const viewportSettingsButton = createElement('button', `${prefix}_viewport-settings_button`, { innerHTML: 'Viewport settings' });

    const setScaleContainer = createElement('div', `${prefix}_setscale_container`);
    const setScaleInputContainer = createElement('div', `${prefix}_setscale_input_container`);
    const setScaleInput = createElement('input', null, {
        type: 'number', value: '1', min: '0.5', max: '22', step: '0.1', id: 'animationscale'
    });
    const setScaleLabel = createElement('label', null, { innerHTML: 'Animation scale', htmlFor: 'animationscale' });

    const secondsToRecordContainer = createElement('div', `${prefix}_secondstorecord_container`);
    const secondsToRecordInput = createElement('input', null, {
        type: 'number', value: '1', min: '1', max: '25', id: 'secondstorecord'
    });
    const secondsToRecordLabel = createElement('label', null, {
        innerHTML: 'Seconds to record (default 1, max 25)', htmlFor: 'secondstorecord'
    });

    let animationScale;
    let recordTime;

    const applyScale = () => {
        player.skeleton.scaleX = animationScale;
        player.skeleton.scaleY = animationScale;
    };

    viewportSettingsButton.addEventListener('click', () => {
        openViewportSettings(player, () => changeAnimationButton.click());
    });

    changeAnimationButton.addEventListener('click', () => {
        animationNames = player.animationState.data.skeletonData.animations.map(animation => animation.name);

        animationIndex = animationIndex == (animationNames.length - 1) ? 0 : animationIndex + 1;
        player.setAnimation(animationNames[animationIndex]);
        changeAnimationLabel.innerHTML = `Playing "${player.animationState.tracks[0].animation.name}"`;

        if(animationScale) applyScale();
    });

    setScaleInput.addEventListener('change', () => {
        animationScale = +setScaleInput.value;
    });

    setScaleButton.addEventListener('click', applyScale);

    secondsToRecordInput.addEventListener('change', () => {
        recordTime = secondsToRecordInput.value;
    });

    startRecordingButton.addEventListener('click', () => {
        recordPlayerAnimation(+recordTime * 1000);
    });

    secondsToRecordContainer.append(secondsToRecordInput, secondsToRecordLabel);

    setScaleInputContainer.append(setScaleInput, setScaleLabel);
    setScaleContainer.append(setScaleInputContainer);

    changeAnimationContainer.append(changeAnimationButton, changeAnimationLabel);

    buttonsContainer.append(
        changeAnimationContainer,
        setScaleContainer,
        setScaleButton,
        viewportSettingsButton,
        secondsToRecordContainer,
        startRecordingButton
    );

    document.querySelector(`.${prefix}`).appendChild(buttonsContainer);
};
