const marked = require('marked');
const configManager = require('../../assets/js/configManager');
const { showNotification } = require('../../assets/js/notificationManager');

marked.setOptions({
    gfm: true,  // Activer GitHub Flavored Markdown
    breaks: true,  // Gérer les sauts de ligne
    sanitize: true  // Empêcher les balises HTML potentiellement dangereuses
});

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
    function fetchAndDisplayReleaseNotes() {
        fetch('https://api.github.com/repos/maximemockelyn/mod-manager-tf2/releases')
            .then(response => response.json())
            .then(data => {
                if(data[0] && data[0].body) {
                    const releaseNotesMarkdown = data[0].body; // Markdown des notes de mise à jour
                    // Conversion en HTML
                    releaseNotesContainer.innerHTML = marked.parse(releaseNotesMarkdown);
                }else {
                    releaseNotesContainer.innerHTML = "Aucune mise à jour disponible"
                }
            })
            .catch(error => {
                showNotification('Erreur lors de la récupération des notes de mise à jour', 'error', 2500)
                console.error('Erreur lors de la récupération des notes de mise à jour:', error);
            });
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

    fetchAndDisplayReleaseNotes();
})

