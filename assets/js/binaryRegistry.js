const fs = require('fs');
const path = require('path');

function getBinaryList() {
    const configPath = path.join(__dirname, '../../config.json');
    const rawData = fs.readFileSync(configPath);
    const config = JSON.parse(rawData);
    return config.files;
}

module.exports = { getBinaryList };