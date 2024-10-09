const { ipcRenderer } = require('electron');

ipcRenderer.on('download-status', (event, status) => {
    const progressBar = document.getElementById('progress-bar');

    if (status.status === 'start') {
        progressBar.style.width = '0%';
        progressBar.textContent = 'Téléchargement en cours...';
    } else if (status.status === 'complete') {
        progressBar.style.width = '100%';
        progressBar.textContent = 'Téléchargement terminé !';
    } else if (status.status === 'error') {
        progressBar.textContent = 'Erreur lors du téléchargement.';
    }
});