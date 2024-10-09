const {ipcRenderer}  = require('electron')
const fs             = require('fs-extra')
const os             = require('os')
const path           = require('path')
const ConfigManager  = require('../../assets/js/configManager')

ConfigManager.load()

