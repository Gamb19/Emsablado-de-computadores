const indexedDB = window.indexedDB

if (indexedDB) {
    let db
    const req = indexedDB.open("Users",1)

    // Base de datos
    req.onsuccess = ()=>{
        db = req.result
        console.log("OPEN",db);
        readComponents()
    }

    // Si hay un usuario ya logiado, lo redirige a la pagina principal
    const readComponents = ()=>{
        const transaction = db.transaction(['Components'])
        const objectStore = transaction.objectStore('Components')
        const req = objectStore.openCursor()
        req.onsuccess = (e)=>{
            const cursor = e.target.result
            if (cursor) {
                printData(cursor.value)
            }
        }
        req.onerror = (e) =>{
            console.log(e);
        }
    }
}

function printData(data) {
    const { Intel, Ryzen } = data
    

    let selectMarca = document.getElementById('select-marca')
    selectMarca.addEventListener('change', (e)=>{

        if (e.target.value === 'Intel') {
            let data = Object.entries(Intel)
            printOptions(data)
        }
        else {
            const data = Object.entries(Ryzen)
            printOptions(data)
        }

    })
}

function printOptions(data) {

    // El nombre de las (key) de cada (marca) debe ser igual al (id) de cada (select)
    // La separacion de cada palabra de un id o key tiene que ser con un ( _ )
    /* MarcaIntel: {
        key1:"",
        key2:""
        }
    */

    data.forEach(element => {

        // element[0] -> son las key de cada marca
        // algunas key viene separadas con ( _ )
        // element[1] -> Es la data de cada option (key)
        
        let select = document.getElementById(`${element[0]}`)
        select.innerHTML = '' //Se limpia los selects
        let option = document.createElement('option') // Se crean denuevo las opciones principales
        option.setAttribute = 'selected'
        option.textContent = element[0].replace(RegExp(/_/g),' ') // Remplazamos los ( _ ) por espacios en blanco
        select.insertAdjacentElement('beforeend',option)

        // console.log(element[0].replace(RegExp(/_/g),' ')

        element[1].forEach(nameOption => {
            // Se crean las opciones de cada select
            let option = document.createElement('option')
            option.value = nameOption
            option.textContent = nameOption
            select.insertAdjacentElement('beforeend',option)
        })

    });

}