const indexedDB = window.indexedDB

//¬ Se declaro globalmente para poder hacer uso de ella mas facilmente
let handleSelectChange = ()=>{};

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
            deleteEvent(data)
            printOptions(data, e.target.value) // (e.target.value) -> Brand name
        }
        else {
            const data = Object.entries(Ryzen)
            deleteEvent(data)
            printOptions(data, e.target.value) // (e.target.value) -> Brand name
        }

    })
}

//Funcion para eliminar el evento change que se repetia en cada cambio de marca
function deleteEvent(data) {
    data.forEach(element => {
        const select = document.getElementById(`select-${element[0]}`)
        // (handleSelectChange) esta declarada globalmente al incio del codigo
        select.removeEventListener("change", handleSelectChange)
    })
}

function printOptions(data, marca) {

    // El nombre de las (key) de cada (marca) debe ser igual al (id) de cada (select)
    // La separacion de cada palabra de un id o key tiene que ser con un ( _ )
    /* MarcaIntel: {
        key1:"",
        key2:""
        }
    */

    // Funcion para poder hacer el (select.removeEventListener)
    handleSelectChange = (elem) => {
        getImageUrl(elem, marca);
    }

    data.forEach(element => {

        // element[0] -> son las key de cada marca
        // algunas key viene separadas con ( _ )
        // element[1] -> Es la data de cada option (key)

        const select = document.getElementById(`select-${element[0]}`)
        select.addEventListener('change', handleSelectChange)

        select.innerHTML = "" //Se limpia los selects
        const option = document.createElement('option') // Se crean de nuevo las opciones principales
        option.setAttribute = 'selected'
        option.textContent = element[0].replace(RegExp(/_/g),' ') // Remplazamos los ( _ ) por espacios en blanco
        select.insertAdjacentElement('beforeend',option)

        // console.log(element[0].replace(RegExp(/_/g),' '))

        element[1].forEach(nameOption => {
            // Se crean las opciones de cada select
            let option = document.createElement('option')
            option.value = nameOption
            option.textContent = nameOption
            select.insertAdjacentElement('beforeend',option)
        })

    });

}

async function getImageUrl (e, keyMarca) {

    // Los id de cada select tienen concatenado el texto ("select-") + propertyName
    // En este caso solo se necesita el (propertyName) para eso se uso el (replace)
    const keyPropiedad = e.target.id.replace('select-','')
    const keyUrl = e.target.value

    // Se hizo el llamado de la data que esta en (Images_Component.json)
    const resp = await fetch("../Images_Component.json")
    const data = await resp.json()

    // Se extrajo la data de cada key obtenida por los parametros
    const valueMarca = data[ keyMarca ]
    const valuePropiedad = valueMarca[ keyPropiedad ]
    const urlImg = valuePropiedad[ keyUrl ]

    updateImg(keyPropiedad, urlImg)

}

function updateImg(idDiv, urlImg) {

    const divImg = document.getElementById(`div-${idDiv}`)
    divImg.style.backgroundImage = `url('../${urlImg}')`;

}