const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const creaComic = async(nuevoComic) => {
    const  archivoComics = await fs.readFile('../drilling/textos/comics.txt')
    const  datosComics = JSON.parse(archivoComics);
    const id = uuidv4();

    datosComics[id] = nuevoComic;
    await fs.writeFile('../drilling/textos/comics.txt', JSON.stringify(datosComics, null, 2));
}

module.exports = {creaComic: creaComic};