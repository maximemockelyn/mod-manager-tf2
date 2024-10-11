const https = require('https');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        console.log(`Création du répertoire : ${dirname}`);
        fs.mkdirSync(dirname, { recursive: true });
    }
}

function downloadFile(url, dest, callback) {
    const file = fs.createWriteStream(dest);
    console.log(`Début du téléchargement : ${url}`);
    https.get(url, (response) => {
        console.log(`Statut de la réponse HTTP : ${response.statusCode}`);
        response.pipe(file);
        file.on('finish', () => {
            console.log(`Téléchargement terminé, fichier écrit dans : ${dest}`)
            file.close(() => {
                fs.stat(dest, (err, stats) => {
                    if (err) {
                        console.error(`Erreur lors de la vérification du fichier : ${err.message}`);
                    } else {
                        console.log(`Fichier téléchargé avec succès, taille : ${stats.size} bytes`);
                    }
                });
            });  // Appeler le callback une fois terminé
        });
    }).on('error', (err) => {
        fs.unlink(dest);  // Supprimer le fichier si une erreur survient
        console.error(`Erreur lors du téléchargement de ${url} : ${err.message}`);
        if (callback) callback(err.message);
    });
}

// Fonction pour décompresser un fichier ZIP
function extractZip(zipFilePath, extractTo) {
    console.log(`Décompression du fichier : ${zipFilePath}`);
    fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractTo }))
        .on('close', () => {
            console.log(`Fichier décompressé dans le répertoire : ${extractTo}`);
        })
        .on('error', () => {
            console.error(`Erreur lors de la décompression : ${err.message}`);
        });
}

// Gérer le téléchargement de plusieurs fichiers à partir de la configuration
async function handleDownload(window, binaries) {
    try {
        window.webContents.send('download-status', { status: 'start' });

        for (const file of binaries) {
            const zipFilePath = path.join(file.destination, `${file.name}.zip`);
            console.log('Fichier téléchargé à :', zipFilePath);
            ensureDirectoryExistence(zipFilePath);
            const extractPath = file.destination;

            if (!fs.existsSync(extractPath)) {
                console.log(`Téléchargement de ${file.name}...`);
                await new Promise((resolve, reject) => {
                    downloadFile(file.url, zipFilePath, (err) => {
                        if (err) reject(err);
                        extractZip(zipFilePath, extractPath, (extractErr) => {
                            if (extractErr) reject(extractErr);
                            resolve();
                        });
                    });
                });
            } else {
                console.log(`${file.name} est déjà téléchargé.`);
            }
        }

        window.webContents.send('download-status', { status: 'complete' });
    } catch (error) {
        window.webContents.send('download-status', { status: 'error' });
        console.error('Erreur lors du téléchargement:', error);
    }
}

module.exports = { handleDownload };