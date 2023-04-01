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
            if (cursor && cursor.value.Email == "admin") {
                location.href="http://127.0.0.1:5500/admin.html"
            }else if (cursor){
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
                    let labelPassword  = document.getElementById("labelPassword")
    
                    if (emailDb === emailInput && passwordDb === passwordInput) {
                        location.href="http://127.0.0.1:5500/index.html"
                        resolve(true)
                        onConsulta = false
                        labelPassword.className = ""
                    }
                    if (emailDb === emailInput && passwordDb !== passwordInput) {
                        labelPassword.className = "error"
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

            if (data.Email === "admin" && data.Password === "12345") {
                location.href="http://127.0.0.1:5500/admin.html"
                userLoggedIn(data)
                return false
            }
            // la promesa retorna true o false
            let rtaPromesa = await readUsers(data.Password,data.Email)

            if (rtaPromesa) {
                userLoggedIn(data)
            }
        } catch (error) {
            console.log(error);
        }
    })
}else{
    throw new Error("La base de datos no ha sido creada")
}