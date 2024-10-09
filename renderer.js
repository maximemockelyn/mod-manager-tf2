const { ipcRenderer } = require('electron');

// Événements écoutés pour la mise à jour
ipcRenderer.on('update_available', () => {
    alert('Une nouvelle mise à jour est disponible. Téléchargement en cours...');
});

ipcRenderer.on('update_not_available', () => {
    alert('Votre application est à jour.');
});

ipcRenderer.on('update_error', (event, error) => {
    alert('Erreur lors de la mise à jour : ' + error);
});

ipcRenderer.on('download_progress', (event, progressObj) => {
    let progress = Math.floor(progressObj.percent);
    console.log(`Téléchargement : ${progress}%`);
});

ipcRenderer.on('update_downloaded', () => {
    alert('Mise à jour téléchargée. L\'application va redémarrer pour installer la mise à jour.');
    ipcRenderer.send('restart_app');
});