const remote= require('@electron/remote')

document.addEventListener('DOMContentLoaded', () => {
    // Réduire la fenêtre
    document.getElementById('frameButton_minimize').addEventListener('click', () => {
        let window = remote.getCurrentWindow();
        window.minimize();
    });

// Agrandir / restaurer la fenêtre
    document.getElementById('frameButton_restoredown').addEventListener('click', () => {
        let window = remote.getCurrentWindow();
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    });

// Fermer la fenêtre
    document.getElementById('frameButton_close').addEventListener('click', () => {
        console.log('Bouton fermer cliqué');
        let window = remote.getCurrentWindow();
        window.close();
    });
})