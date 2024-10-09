document.addEventListener('DOMContentLoaded', () => {

    let btn = {
        btnBack: document.querySelector('#backToMain'),
        btnNavDossier: document.querySelector('#dossierLink'),
        btnNavAbout: document.querySelector('#aboutLink'),
    };

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
    }
})

