document.addEventListener('DOMContentLoaded', () => {
    let navLinksContainer = {
        home: document.getElementById('nav-home-link'),
        newmod: document.getElementById('nav-newmod-link'),
        editmod: document.getElementById('nav-editmod-link'),
        convert: document.getElementById('nav-convert-link'),
        modvalidator: document.getElementById('nav-modvalidator-link'),
    }

    navLinksContainer.home.addEventListener('click', e => {
        e.preventDefault()
        console.log(getCurrentView())
        switchView(getCurrentView(), VIEWS.landing)
        currentView = VIEWS.landing
        console.log(getCurrentView())
    })

    navLinksContainer.newmod.addEventListener('click', e => {
        e.preventDefault()
        switchView(getCurrentView(), VIEWS.newmod)
        currentView = VIEWS.newmod
    })
})