const fs = require('fs/promises');

const deleteComics = async(id) => {
    const  archivoComics = await fs.readFile('../drilling/textos/comics.txt')
    const  datosComics = JSON.parse(archivoComics);
    console.log(datosComics[id]);
        delete datosComics[id]
        await fs.writeFile('../drilling/textos/comics.txt', JSON.stringify(datosComics, null, 2));
}



module.exports = {deleteComics: deleteComics}