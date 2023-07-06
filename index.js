const http = require('http');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const { leerComics } = require('./metodosComics/lee.js')
const { creaComic } = require('./metodosComics/crea.js')
const { updateComics } = require('./metodosComics/actualiza.js')
const { deleteComics } = require('./metodosComics/elimina.js')

http.createServer(async (req,res) => {
    const { searchParams, pathname } = new URL(req.url, `http://${req.headers.host}`)
    const params = new URLSearchParams(searchParams)
    console.log(pathname); 
    const id = params.get("id");

if(pathname == "/comics"){
    switch (req.method) {
        case 'GET':
        try {
            await leerComics()
            res.write(archivoComics)
            res.write('\n\nLa lectura y muestra del contenido del archivo comics.txt fue exitosa.')
            res.end();
        } catch (error) {
        res.write("No fue posible mostrar el contenido del archivo comics.txt")
        res.end()
        console.log(`No fue posible mostrar el contenido del archivo comics.txt: ${error}`);
        }
        break;
    
        case 'POST':
        try {
            let datosComic;
            req.on('data', (data) => {
                datosComic = JSON.parse(data);
                res.write(`Se procederá a agregar el siguiente comic:\n\n ${JSON.stringify(datosComic, null, 2)}`)
            })
            req.on('end', async() => {
                await creaComic(datosComic);
                res.write('\nComic agregado exitosamente');
                res.end();
            })
        } catch (error) {
            res.write("ERROR: No fue posible agregar el comic indicado al archivo comics.txt")
            res.end()
        console.log(`No fue posible mostrar el contenido del archivo comics.txt: ${error}`);
        }
        break;

        case 'PUT':
        try {
            let datosParaModificar;

            req.on('data', (datos) => {
                datosParaModificar = JSON.parse(datos);
            })

            req.on('end', async() => {
                await updateComics(id, datosParaModificar)
                res.write('Los datos del comic indicado han sido modificados y cargados al archivo autos.txt')
                res.end();
            })
        } catch (error) {
            res.write('No fue posible actualizar o modificar los datos del comic indicado.')
            res.end();
            console.log(`No fue posible actualizar o modificar los datos del comic indicado: ${error}`);
        }
        break;

        case 'DELETE':
            try {
                await deleteComics(id)
                res.write('\nEl comic indicado ha sido eliminado satisfactoriamente\n');
                res.end()
            } catch (error) {
            res.write('\nHa ocurrido un error. El comic indicado no ha podido ser eliminado.')
            res.end();
            console.log(`El auto indicado no ha podido ser eliminado: ${error}`);
            }
        break;
    
        default:
            break;
    }
}


// CRUD /autos -> Sin modular

try {
    lecturaArchivoAutos = await fs.readFile('./textos/autos.txt')
    res.write('Acceso exitoso al archivo autos.txt\n\n')
} catch (error) {
    res.write('No fue posible acceder al archivo contenedor de autos.')
    res.end();
    console.log(`No fue posible acceder al archivo contenedor de autos: ${error}`);
}
const datosOriginalesAutos = JSON.parse(lecturaArchivoAutos)

    if(pathname == '/autos' && req.method == 'GET') {
        try {
            res.write(lecturaArchivoAutos);
            res.write('\n\nLa lectura y muestra del contenido del archivo autos.txt fue exitosa.')
            res.end();
        } catch (error) {
            res.write("No fue posible mostrar el contenido del archivo autos.txt")
            res.end()
            console.log(`No fue posible mostrar el contenido del archivo autos.txt: ${error}`);
        }
    }

    if(pathname == '/autos' && req.method == 'POST') {
        const identificacion = uuidv4()
        let datosAutos

        req.on('data', (data) => {
            datosAutos = JSON.parse(data);
        })

        req.on('end', async () => {
            try {
                datosOriginalesAutos[identificacion] = datosAutos;
                await fs.writeFile('./textos/autos.txt', JSON.stringify(datosOriginalesAutos, null, 2));
                res.write('Vehículo agregado exitosamente al archivo autos.txt');
                res.end();
            } catch (error) {
                res.write('No fue posible incorporar el vehículo al archivo autos.txt')
                res.end()
                console.log(`No fue posible incorporar el vehículo al archivo autos.txt: ${error}`);
            }
        })
    }

    if(pathname == '/autos' && req.method == 'PUT') {
        let datosParaModificar;

        req.on('data', (datos) => {
            datosParaModificar = JSON.parse(datos);
        })

        req.on('end', async () => {
            try {
                const autoPorModificar = datosOriginalesAutos[id]
                const autoModificado = {...autoPorModificar, ...datosParaModificar }
    
                datosOriginalesAutos[id] = autoModificado
    
                await fs.writeFile('./textos/autos.txt', JSON.stringify(datosOriginalesAutos, null, 2));
                
                res.write(`Datos del auto indicado previos a la actualización:\n`)
                res.write(JSON.stringify(autoPorModificar, null, 2))
                res.write('\nDatos del auto indicado posteriores a la modificación y cargados al archivo autos.txt:\n')
                res.write(JSON.stringify(autoModificado, null, 2));
                res.end();
            } catch (error) {
                res.write('No fue posible actualizar o modificar los datos del auto indicado.')
                res.end();
                console.log(`No fue posible actualizar o modificar los datos del auto indicado: ${error}`);
            }
        })
    }

    if(pathname == '/autos' && req.method == 'DELETE') {
        try {
            res.write('El auto indicado a continuación será eliminado de autos.txt\n')
            res.write(JSON.stringify(datosOriginalesAutos[id], null, 2))
            delete datosOriginalesAutos[id];
            await fs.writeFile('./textos/autos.txt', JSON.stringify(datosOriginalesAutos, null, 2));
            res.write('\nEl auto indicado ha sido eliminado satisfactoriamente\n');
            res.end()
        } catch (error) {
            res.write('\nHa ocurrido un error. El auto indicado no ha podido ser eliminado.')
            res.end();
            console.log(`El auto indicado no ha podido ser eliminado: ${error}`);
        }
    }

})
.listen(3000, function() {
    console.log("Servidor iniciado en el puerto 3000");
})