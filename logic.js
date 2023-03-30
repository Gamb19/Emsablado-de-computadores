const indexedDB = window.indexedDB

function txtBienvenida() {
    if (indexedDB) {
        let db
        const req = indexedDB.open("Users",1)

        req.onsuccess = ()=>{
            db = req.result
            console.log("OPEN",db);
            readLogin()
        }

         // Almacen de la base de datos
        req.onupgradeneeded = ()=>{
            db = req.result
            console.log("Create",db);
            db.createObjectStore("signUp",{
                keyPath:"User"
            }),
            db.createObjectStore("LogIn",{
                keyPath:"Id"
            })
        }

        const readLogin = ()=>{
            const transaction = db.transaction(['LogIn'])
            const objectStore = transaction.objectStore('LogIn')
            const req = objectStore.openCursor()
    
            req.onsuccess = (e)=>{
                const cursor = e.target.result
                if (cursor) {
                    readUsers(cursor.value.Email)
                }
            }
            req.onerror = (e) =>{
                console.log(e);
            }
        }

        const readUsers = (emailLogin)=>{
            const transaction = db.transaction(['signUp'])
            const objectStore = transaction.objectStore('signUp')
            const req = objectStore.openCursor()
            req.onsuccess = (e)=>{
                const cursor = e.target.result
                if (cursor) {
                    if (emailLogin === cursor.value.Email) {
                        let ulMenu = document.getElementById("ulMenu")
                        ulMenu.innerHTML = ""
                        let liMenu = document.createElement("li")
                        liMenu.className = "nav-item"
                        let opcionMenu = document.createElement("a")
                        opcionMenu.textContent = "Cerrar Sesion"
                        opcionMenu.className = "nav-link"
                        opcionMenu.addEventListener("click",()=>{
                            cerrarSesion(db)
                        })

                        liMenu.insertAdjacentElement("beforeend",opcionMenu)
                        ulMenu.insertAdjacentElement("beforeend",liMenu)
                        
                        const textoNameUser = document.getElementById("smsBienvenida")
                        textoNameUser.textContent = cursor.value.User
                    }
                    cursor.continue()
                }
                
            }
            req.onerror = (e) =>{
                console.log(e);
            }
        }
    }
}

function cerrarSesion(db) {
    const transaction = db.transaction(['LogIn'],'readwrite')
        const objectStore = transaction.objectStore('LogIn')
        objectStore.clear()
        window.location.reload();
}

txtBienvenida()