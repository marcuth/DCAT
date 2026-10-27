const NOTIFICATION_DEFAULT_DURATION_MS = 5000;

const getNotificationContainer = () => {
    let container = document.querySelector('.Notification__container');

    if(!container){
        container = document.createElement('div');
        container.classList.add('Notification__container');
        document.body.append(container);
    }

    return container;
};

const showNotification = (message, durationInMs = NOTIFICATION_DEFAULT_DURATION_MS) => {
    const notification = document.createElement('div');
    notification.classList.add('Notification');
    notification.setAttribute('role', 'status');

    const text = document.createElement('p');
    text.classList.add('Notification__message');
    text.textContent = message;

    const closeButton = document.createElement('span');
    closeButton.classList.add('Notification__close');
    closeButton.textContent = 'X';

    const dismiss = () => notification.remove();

    closeButton.addEventListener('click', dismiss);
    notification.append(text, closeButton);
    getNotificationContainer().append(notification);

    setTimeout(dismiss, durationInMs);
};
