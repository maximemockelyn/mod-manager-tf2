const fs = require('fs-extra');
const path = require('path');

// Lorsque le formulaire de création est soumis
document.getElementById('formNewMod').addEventListener('submit', (e) => {
    e.preventDefault();  // Empêche le rechargement de la page

    // Récupérer les données du formulaire
    const nameMod = document.getElementById('nameMod').value.trim();
    const descMod = document.getElementById('descMod').value.trim();
    const modSeverityAdd = document.getElementById('modSeverityAdd').value.trim();
    const modSeverityRemove = document.getElementById('modSeverityRemove').value.trim();
    const authorsMod = document.getElementById('authorsMod').value.trim();
    const tagsMod = document.getElementById('tagsMod').value.trim();

    // Vérifier si tous les champs sont remplis
    if (!nameMod || !descMod || !modSeverityAdd || !modSeverityRemove || !authorsMod || !tagsMod) {
        alert('Tous les champs doivent être remplis');
        return;
    }

    // Envoyer les données au processus principal pour créer le mod dans le dossier temporaire
    ipcRenderer.send('create-new-mod', { nameMod, descMod, modSeverityAdd, modSeverityRemove, authorsMod, tagsMod });
});

// Réception de la réponse du processus principal
ipcRenderer.on('mod-created', (event, result) => {
    if (result.success) {
        showNotification('Le mod a été créé avec succès dans le dossier temporaire.')
    } else {
        showNotification(`Erreur lors de la création du mod : ${result.error}`, 'error')
        console.log(result.error)
        console.log(result.error)
    }
});