
const configManager = require('../../assets/js/configManager');
const { showNotification } = require('../../assets/js/notificationManager');

document.addEventListener('DOMContentLoaded', () => {

    let btn = {
        btnBack: document.querySelector('#backToMain'),
        btnNavDossier: document.querySelector('#dossierLink'),
        btnNavAbout: document.querySelector('#aboutLink'),
        btnSelectStagingArea: document.querySelector('#selectStagingArea'),
        btnSelectTempFolder: document.querySelector('#selectTempFolder'),
        btnSaveStagingArea: document.querySelector('#saveStagingArea'),
        btnSaveTempFolder: document.querySelector('#saveTempFolder'),
    };

    let input = {
        stagingArea: document.querySelector('#stagingArea'),
        tempFolder: document.querySelector('#tempFolder')
    }

    const releaseNotesContainer = document.getElementById('releaseNotes');

    async function loadLatestRelease() {
        try {
            const response = await fetch('https://api.github.com/repos/maximemockelyn/mod-manager-tf2/releases/latest');
            const data = await response.json();

            // Vérifier si la réponse contient des notes de release
            if (data && data.body) {
                releaseNotesContainer.innerHTML = data.body;  // Insérer les notes dans le container
            } else {
                releaseNotesContainer.innerHTML = 'Aucune note de mise à jour disponible.';
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des notes de release :', error);
            releaseNotesContainer.innerHTML = 'Impossible de récupérer les notes de mise à jour.';
        }
    }

    if(btn) {
        btn.btnBack.addEventListener('click', () => {
            switchView("#settingsContent", "#welcomeContainer")
        })

        btn.btnNavDossier.addEventListener('click', () => {
            document.getElementById('dossierSection').style.display = 'block';
            document.getElementById('aboutSection').style.display = 'none';
        });

        btn.btnNavAbout.addEventListener('click', () => {
            document.getElementById('aboutSection').style.display = 'block';
            document.getElementById('dossierSection').style.display = 'none';
        });

        btn.btnSelectStagingArea.addEventListener('click', async () => {
            const folder = await ipcRenderer.invoke('select-staging-folder');
            if (folder) {
                input.stagingArea.value = folder;
            }
        })

        btn.btnSelectTempFolder.addEventListener('click', async () => {
            const folder = await ipcRenderer.invoke('select-temp-folder');
            if (folder) {
                input.tempFolder.value = folder;
            }
        })

        btn.btnSaveStagingArea.addEventListener('click', () => {
            const path = input.stagingArea.value;
            if (path) {
                configManager.setStagingArea(path);  // Sauvegarder dans configManager
                showNotification('Chemin du dossier staging_area sauvegardé avec succès.', 'success');
            } else {
                showNotification('Impossible de sauvegarder le chemin. Veuillez vérifier.', 'danger');
            }
        })

        btn.btnSaveTempFolder.addEventListener('click', () => {
            const path = input.tempFolder.value;
            if (path) {
                configManager.setStagingArea(path);  // Sauvegarder dans configManager
                showNotification('Chemin du dossier temporaire sauvegardé avec succès.', 'success');
            } else {
                showNotification('Impossible de sauvegarder le chemin. Veuillez vérifier.', 'danger');
            }
        })
    }

    loadLatestRelease();
})

