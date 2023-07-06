const fs = require('fs/promises');

const updateComics = async(id, datosParaModificar) => {
    const  archivoComics = await fs.readFile('../drilling/textos/comics.txt')
    const  datosComics = JSON.parse(archivoComics);
    const comicPorModificar = datosComics[id]
    const comicModificado = {...comicPorModificar, ...datosParaModificar}


    
    datosComics[id] = comicModificado

    await fs.writeFile('../drilling/textos/comics.txt', JSON.stringify(datosComics, null, 2));
}

module.exports = {updateComics: updateComics}