if(!sessionStorage.getItem('orientationNoticeShown')){
    showNotification("If you're on mobile, please rotate your device to landscape mode for a proper experience", 8000);
    sessionStorage.setItem('orientationNoticeShown', 'true');
}
