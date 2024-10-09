const fs = require('fs-extra')
const os   = require('os')
const path = require('path')
const logger = require('electron-log')
const sysRoot = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const dataPath = path.join(sysRoot, '.modManagerTf2')
const managerDir = require('@electron/remote').app.getPath('userData')

exports.getManagerDirectory = function(){
    return managerDir
}

exports.getDataDirectory = function(def = false){
    return !def ? config.settings.manager.dataDirectory : DEFAULT_CONFIG.settings.manager.dataDirectory
}

exports.setDataDirectory = function(dataDirectory){
    config.settings.manager.dataDirectory = dataDirectory
}

const configPath = path.join(exports.getManagerDirectory(), 'config.json')
const configPathLEGACY = path.join(dataPath, 'config.json')
const firstLaunch = !fs.existsSync(configPath) && !fs.existsSync(configPathLEGACY)

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