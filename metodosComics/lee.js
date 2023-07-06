const fs = require('fs/promises');

const leerComics = async () => {
    return archivoComics = await fs.readFile('../drilling/textos/comics.txt')
}

module.exports = {leerComics: leerComics}