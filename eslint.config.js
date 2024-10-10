module.exports = [
    {
        ignores: ["dist/**/*"], // Ignorer les fichiers générés
    },
    {
        languageOptions: {
            ecmaVersion: 2021, // Version de ECMAScript
            sourceType: "module", // Utiliser les modules ES
        },
        plugins: {
            node: require('eslint-plugin-node'),
            electron: require('eslint-plugin-electron')
        },
        rules: {
            "no-console": "off",  // Permet d'utiliser console.log dans le code
            "node/no-unpublished-require": "off" // Désactiver l'alerte pour les modules Electron non publiés
        }
    }
];