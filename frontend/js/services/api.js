const api = {
    getAnimationDataUri: (name) => axios.post('/data-uri', { name }),
    listZips: () => axios.get('/list-zips'),
    copyToPublic: (path, filename, type) => axios.post('/copy-to-public', { path, filename, type }),
    uploadBackground: (filename, data) => axios.post('/upload-background', { filename, data }),
    uploadZipFile: (filename, data) => axios.post('/upload-zip-file', { filename, data }),
    extractFile: (filename) => axios.post('/extract-file', { filename })
};
