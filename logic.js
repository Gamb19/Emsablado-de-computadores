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
                keyPath:"id"
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
                if (cursor && cursor.value.Email == "admin") {
                    administracion(db)
                    let optionCerrar = document.getElementById("cerrarSesion")
                    optionCerrar.addEventListener("click",(e)=>{
                        cerrarSesion(db)
                    })
                }else if (cursor){
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
                        textoNameUser.textContent ="Hola, "+ cursor.value.User
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
    location.href="http://127.0.0.1:5500/index.html"
}

function administracion(db) {
    let keyUser = ""
    let optionEjecutar = ""
    let divListaUser = document.getElementById("listaUser")
    let formUpdate = document.getElementById("formEditar")
    formUpdate.addEventListener("submit",(e)=>{
        formUpdateData(e)
    })
    
    const printUsers = ()=>{
        const transaction = db.transaction(['signUp'], 'readwrite')
        const objectStore = transaction.objectStore('signUp')
        const req = objectStore.openCursor()
        divListaUser.innerHTML = ""

        req.onsuccess = (e)=>{
            const cursor = e.target.result
            if (cursor) {
                let dataUser = {
                    key: cursor.key,
                    user: cursor.value.User,
                    email:cursor.value.Email,
                    password:cursor.value.Password
                }
                let ulLista = document.createElement("ul")
                ulLista.className = "navbar-nav col-lg-11 listaAdmin"
                let liNameUser = document.createElement("li")
                liNameUser.className = "nav-item"
                liNameUser.textContent = cursor.value.User
                let liEmail = document.createElement("li")
                liEmail.className = "nav-item"
                liEmail.textContent = cursor.value.Email
                let liPassword = document.createElement("li")
                liPassword.className = "nav-item"
                liPassword.textContent = cursor.value.Password
                let btnEditar = document.createElement("button")
                btnEditar.className = "btn btn-secondary"
                btnEditar.textContent = "Editar"
                btnEditar.addEventListener("click",(e)=>{
                    document.getElementById("user").value = dataUser.user
                    document.getElementById("email").value = dataUser.email
                    document.getElementById("password").value = dataUser.password
                    formUpdate.className = ""
                    keyUser = dataUser.key
                    optionEjecutar = "Editar"
                })
                let btnEliminar = document.createElement("button")
                btnEliminar.className = "btn btn-secondary"
                btnEliminar.textContent = "Eliminar"
                btnEliminar.addEventListener("click",(e)=>{
                    keyUser = dataUser.key
                    optionEjecutar = "Eliminar"
                    updateDB()
                })

                divListaUser.insertAdjacentElement("beforeend",ulLista)
                ulLista.insertAdjacentElement("beforeend",liNameUser)
                ulLista.insertAdjacentElement("beforeend",liEmail)
                ulLista.insertAdjacentElement("beforeend",liPassword)
                ulLista.insertAdjacentElement("beforeend",btnEditar)
                ulLista.insertAdjacentElement("beforeend",btnEliminar)

                cursor.continue()
            }
        }

        req.onerror = (e) =>{
            console.log(e);
        }
    }

    const updateDB = (dataForm)=>{
        const transaction = db.transaction(['signUp'], 'readwrite')
        const objectStore = transaction.objectStore('signUp')
        const req = objectStore.get(keyUser);

        req.onsuccess = (e)=>{
            const data = e.target.result
            if (data && optionEjecutar === "Editar") {
                data.Email = dataForm.Email
                data.User = dataForm.User
                data.Password = dataForm.Password
                data.confEmail = dataForm.Email
                data.confPassword = dataForm.Password

                const updateRequest = objectStore.put(data);
                updateRequest.onsuccess = (event) => {
                    formUpdate.className = "displayNone"
                    printUsers()
                }
            }
            else if(data && optionEjecutar === "Eliminar"){
                const deleteRequest = objectStore.delete(keyUser);
                deleteRequest.onsuccess = (event) => {
                    printUsers()
                }

            }
            else throw new Error("Error en la consulta")
        }
        req.onerror = (e) =>{
            console.log(e);
        }
    }


    const formUpdateData = (e)=>{
        e.preventDefault()
        let data = {
            User: e.target.user.value,
            Email: e.target.email.value,
            Password: e.target.password.value,
        }
        updateDB(data)
    }

    // Lo Primero en ejecutarse en Administracion
    printUsers()
}

txtBienvenida()