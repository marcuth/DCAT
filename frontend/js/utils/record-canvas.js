const recordCanvas = (canvas, timeInMs) => {
    const recordedChunks = [];

    return new Promise((resolve) => {
        const stream = canvas.captureStream(60);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9"
        });

        mediaRecorder.start(timeInMs || 4000);

        mediaRecorder.ondataavailable = (event) => {
            recordedChunks.push(event.data);

            if(mediaRecorder.state == 'recording'){
                mediaRecorder.stop();
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });

            resolve(URL.createObjectURL(blob));
        };
    });
};
