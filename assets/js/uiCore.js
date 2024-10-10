const {ipcRenderer, shell, webFrame} = require('electron')
const remote = require('@electron/remote')
//const isDev = require('../../assets/js/isDev')
const LoggerUtil = require('electron-log')
LoggerUtil.initialize();

process.traceProcessWarnings = true
process.traceDeprecation = true

window.eval = global.eval = function () {
    throw new Error('Sorry, this app does not support window.eval().')
}

remote.getCurrentWebContents().on('devtools-opened', () => {
    console.log('%cThe console is dark and full of terrors.', 'color: white; -webkit-text-stroke: 4px #a02d2a; font-size: 60px; font-weight: bold')
    console.log('%cIf you\'ve been told to paste something here, you\'re being scammed.', 'font-size: 16px')
    console.log('%cUnless you know exactly what you\'re doing, close this window.', 'font-size: 16px')
})

webFrame.setZoomLevel(0)
webFrame.setVisualZoomLevelLimits(1, 1)

let updateCheckListener

function showUpdateUI(info) {
    switchView(getCurrentView(), VIEWS.settings, 500, 500, () => {
        settingsNavItemListener(document.getElementById('settingsNavUpdate'), false)
    })
}

document.addEventListener('readystatechange', () => {
    if(document.readyState === 'interactive') {
        LoggerUtil.info("Chargement de UICore 1.0...")

        Array.from(document.getElementsByClassName('fCb')).map((val) => {
            val.addEventListener('click', e => {
                const window = remote.getCurrentWindow()
                window.close()
            })
        })

        Array.from(document.getElementsByClassName('fRb')).map((val) => {
            val.addEventListener('click', e => {
                const window = remote.getCurrentWindow()
                if(window.isMaximized()){
                    window.unmaximize()
                } else {
                    window.maximize()
                }
                document.activeElement.blur()
            })
        })

        Array.from(document.getElementsByClassName('fMb')).map((val) => {
            val.addEventListener('click', e => {
                const window = remote.getCurrentWindow()
                window.minimize()
                document.activeElement.blur()
            })
        })
    } else if(document.readyState === 'complete') {
        LoggerUtil.log("Chargement Terminre...")
    }
})

ipcRenderer.on('updateAvailable', (event, info) => {
    // Ajouter un indicateur visuel à côté du numéro de version
    const versionElement = document.getElementById('version');
    const updateIndicator = document.createElement('span');
    updateIndicator.innerHTML = ' (Mise à jour disponible!)';
    updateIndicator.style.color = 'red'; // Change la couleur pour que cela soit bien visible
    versionElement.appendChild(updateIndicator);
});

ipcRenderer.on('noUpdate', () => {
    console.log('Pas de mise à jour disponible.');
});
