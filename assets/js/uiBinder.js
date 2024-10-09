const path = require('path')
const isDev = require('../../assets/js/isDev')
const ConfigManager = require('../../assets/js/configManager')
const $ = require("jquery");
//const { DistroAPI } = require('../../assets/js/distromanager')

let rscShouldLoad = false
let fatalStartupError = false

const VIEWS = {
    landing: '#welcomContainer',
    settings: '#settingsContent'
}

let currentView

function switchView(current, next, currentFadeTime = 500, nextFadeTime = 500, onCurrentFade = () => {}, onNextFade = () => {}){
    currentView = next
    $(`${current}`).fadeOut(currentFadeTime, async () => {
        await onCurrentFade()
        $(`${next}`).fadeIn(nextFadeTime, async () => {
            await onNextFade()
        })
    })
}

function getCurrentView(){
    return currentView
}

async function showMainUI(data){

    if(!isDev){
        logger.info('Initializing..')
        ipcRenderer.send('autoUpdateAction', 'initAutoUpdater', ConfigManager.getAllowPrerelease())
    }

    setTimeout(() => {
        document.getElementById('frameBar').style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
        document.body.style.backgroundImage = `url('../../assets/images/backgrounds/${document.body.getAttribute('bkid')}.jpg')`
        $('#main').show()

        currentView = VIEWS.welcome
        $(VIEWS.welcome).fadeIn(1000)

        Array.from(document.getElementsByClassName('settings')).map((val) => {
            val.addEventListener('click', e => {
                console.log('click')
                console.log(val, e)
                $("#settingsContent").fadeIn(1000)
                $("#welcomeContent").fadeOut(1000)
            })
        })

    }, 750)
}

showMainUI()

function showFatalStartupError(){
    setTimeout(() => {
        $('#loadingContainer').fadeOut(250, () => {
            document.getElementById('overlayContainer').style.background = 'none'
            setOverlayContent(
                Lang.queryJS('uibinder.startup.fatalErrorTitle'),
                Lang.queryJS('uibinder.startup.fatalErrorMessage'),
                Lang.queryJS('uibinder.startup.closeButton')
            )
            setOverlayHandler(() => {
                const window = remote.getCurrentWindow()
                window.close()
            })
            toggleOverlay(true)
        })
    }, 750)
}

document.addEventListener('readystatechange', async () => {

    if (document.readyState === 'interactive' || document.readyState === 'complete'){
        if(rscShouldLoad){
            rscShouldLoad = false
            if(!fatalStartupError){
                await showMainUI(data)
            } else {
                showFatalStartupError()
            }
        }
    }

}, false)