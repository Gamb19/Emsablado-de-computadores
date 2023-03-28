const indexedDB = window.indexedDB
const form = document.getElementById("form")

if (indexedDB && form) {
    let db
    const req = indexedDB.open("Users",1)
    let onConsulta = true

    // Base de datos
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

    // Registrar el login
    const userLoggedIn = (data)=>{
        const transaction = db.transaction(['LogIn'],'readwrite')
        const objectStore = transaction.objectStore('LogIn')
        objectStore.clear()
        objectStore.add(data)
    }

    // Si hay un usuario ya logiado, lo redirige a la pagina principal
    const readLogin = ()=>{
        const transaction = db.transaction(['LogIn'])
        const objectStore = transaction.objectStore('LogIn')
        const req = objectStore.openCursor()

        req.onsuccess = (e)=>{
            const cursor = e.target.result
            if (cursor) {
                location.href="http://127.0.0.1:5500/index.html"
            }
        }
        req.onerror = (e) =>{
            console.log(e);
        }
    }

    // iniciar sesion
    const readUsers = (passwordInput,emailInput)=>{
        const transaction = db.transaction(['signUp'])
        const objectStore = transaction.objectStore('signUp')
        const req = objectStore.openCursor()
        return new Promise((resolve,reject)=>{
            req.onsuccess = (e)=>{
                const cursor = e.target.result
                if (cursor && onConsulta) {
                    let emailDb = cursor.value.Email
                    let passwordDb = cursor.value.Password
    
                    if (emailDb === emailInput && passwordDb === passwordInput) {
                        location.href="http://127.0.0.1:5500/index.html"
                        resolve(true)
                        onConsulta = false
                    }
                    cursor.continue()
                }
                else reject("Los datos no coinciden")
            }
            req.onerror = (e) =>{
                console.log(e);
            }
        })
    }

    form.addEventListener("submit",async(e)=>{
        e.preventDefault()
        let data = {
            Id: 1,
            Email: e.target.email.value,
            Password: e.target.password.value
        }

        // Validar si el usuario existe
        try {
            // la promesa retorna true o false
            let promesa = await readUsers(data.Password,data.Email)

            if (promesa) {
                userLoggedIn(data)
            }
        } catch (error) {
            console.log(error);
        }
    })
}else{
    throw new Error("La base de datos no ha sido creada")
}