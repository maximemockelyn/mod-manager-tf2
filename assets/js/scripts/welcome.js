const {formatDate} = require('../../assets/js/configManager')

function checkForUpdates() {
    fetch('https://api.github.com/repos/maximemockelyn/mod-manager-tf2/releases')
        .then(response => response.json())
        .then(data => {
            document.getElementById('last-update').innerText = data[0].tag_name+':'+formatDate(data[0].published_at);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des mises à jour:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    checkForUpdates()
})