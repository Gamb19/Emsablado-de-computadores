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
                printComponents(cursor.value)
            }
        }
        req.onerror = (e) =>{
            console.log(e);
        }
    }
}

function printComponents(data) {

    const { Intel, Ryzen } = data

    let containerComp = document.getElementById('containerComponents')
    Intel.forEach(element => {
        console.log(element)
    });
}