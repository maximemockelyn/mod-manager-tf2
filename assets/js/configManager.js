const fs = require('fs-extra')
const path = require('path')
const logger = require('electron-log')
const sysRoot = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const dataPath = path.join(sysRoot, '.modManagerTf2')


const configPath = path.join(process.env.APPDATA, 'config.json')
const configPathLEGACY = path.join(dataPath, 'config.json')
const firstLaunch = !fs.existsSync(configPath) && !fs.existsSync(configPathLEGACY)

console.log(configPathLEGACY)

const DEFAULT_CONFIG = {
    settings: {
        manager: {
            allowPrerelease: false,
            dataDirectory: dataPath
        }
    },
    newsCache: {
        date: null,
        content: null,
        dismissed: false
    },
    javaConfig: {}
}

let config = null

exports.save = function(){
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'UTF-8')
}

exports.load = function(){
    let doLoad = true

    if(!fs.existsSync(configPath)){
        // Create all parent directories.
        fs.ensureDirSync(path.join(configPath, '..'))
        if(fs.existsSync(configPathLEGACY)){
            fs.moveSync(configPathLEGACY, configPath)
        } else {
            doLoad = false
            config = DEFAULT_CONFIG
            exports.save()
        }
    }
    if(doLoad){
        let doValidate = false
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'UTF-8'))
            doValidate = true
        } catch (err){
            logger.error(err)
            logger.info('Configuration file contains malformed JSON or is corrupt.')
            logger.info('Generating a new configuration file.')

            fs.ensureDirSync(path.join(configPath, '..'))
            config = DEFAULT_CONFIG
            exports.save()
        }
        if(doValidate){
            exports.save()
        }
    }
    logger.info('Successfully Loaded')
}

exports.isLoaded = function(){
    return config != null
}

exports.isFirstLaunch = function(){
    return firstLaunch
}

exports.getTempNativeFolder = function(){
    return 'WCNatives'
}

exports.getNewsCache = function(){
    return config.newsCache
}
exports.setNewsCache = function(newsCache){
    config.newsCache = newsCache
}
exports.setNewsCacheDismissed = function(dismissed){
    config.newsCache.dismissed = dismissed
}

exports.getStagingArea = function() {
    return config.settings.manager.stagingArea || '';
};

exports.setStagingArea = function(stagingAreaPath) {
    config.settings.manager.stagingArea = stagingAreaPath;
    exports.save();  // Sauvegarder après modification
};

exports.getTempFolder = function() {
    return config.settings.manager.tempFolder || '';
};

exports.setTempFolder = function(tempFolderPath) {
    config.settings.manager.tempFolder = tempFolderPath;
    exports.save();  // Sauvegarder après modification
};

exports.formatDate = function formatDate(isoDate) {
    // Crée un objet Date à partir de la chaîne ISO 8601
    const date = new Date(isoDate);

    // Extrait l'année, le mois et le jour
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajoute un zéro devant si le mois est sur un seul chiffre
    const day = String(date.getDate()).padStart(2, '0'); // Ajoute un zéro devant si le jour est sur un seul chiffre

    // Concatène pour obtenir le format YYYYMMDD
    return `${year}${month}${day}`;
}