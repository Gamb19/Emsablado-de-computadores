const indexedDB = window.indexedDB
const form = document.getElementById("form")

if (indexedDB && form) {
    let db
    let onConsulta = true
    const req = indexedDB.open("Users",1)

    // Base de datos
    req.onsuccess = ()=>{
        db = req.result
        console.log("OPEN",db);
        readLogin()
    }

    // Almacen de la base de datos
    // req.onupgradeneeded = ()=>{
    //     db = req.result
    //     console.log("Create",db);
    //     db.createObjectStore("signUp",{
    //         autoIncrement:true
    //     }),
    //     db.createObjectStore("LogIn",{
    //         keyPath:"Id"
    //     })
    // }

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

    // Agregar usuarios
    const addUser = (data)=>{
        const transaction = db.transaction(['signUp'],'readwrite')
        const objectStore = transaction.objectStore('signUp')
        objectStore.add(data)
    }

    // Funcion para verificar los usuarios
    const validateUser = (userInput,emailInput)=>{
        const transaction = db.transaction(['signUp'])
        const objectStore = transaction.objectStore('signUp')
        const req = objectStore.openCursor()
        const labelUser = document.getElementById("labelUser")
        const inputUser = document.getElementById("user")
        const labelEmail = document.getElementById("labelEmail")
        const inputEmail = document.getElementById("email")

        return new Promise((resolve, reject) => {
            req.onsuccess = (e)=>{
                const cursor = e.target.result
                if (cursor && onConsulta) {
                    let userId = cursor.value.User
                    let emailUserBd = cursor.value.Email

                    if (userId === userInput) {
                        labelUser.className = "error",
                        inputUser.placeholder = "El usuario ya existe",
                        form.user.value = "",
                        reject(Error(false));
                    }
                    else {
                        labelUser.className = ""
                        inputUser.placeholder = "Usuario"
                    }
                    if (emailUserBd === emailInput) {
                        labelEmail.className = "error"
                        inputEmail.placeholder = "El correo ya existe"
                        form.email.value = ""
                        reject(Error(false));
                    }
                    else {
                        labelEmail.className = ""
                        inputEmail.placeholder = "Correo"
                    }
                    cursor.continue()
                }
                else {
                    resolve(true)
                    onConsulta = false
                }
            }

            req.onerror = (error) =>{
                console.log(error);
            }
        })
    }
    
    req.onerror = (error)=>{
        console.log("Error", error);
    }

    // Evento del formulario
    form.addEventListener("submit",async (e)=>{
        let labelEmail = document.getElementById("labelEmail")
        let labelConfEmail = document.getElementById("labelConfEmail")
        let inputConfEmail = document.getElementById("confEmail")
        let labelPassword = document.getElementById("labelPassword")
        let labelConfPassword = document.getElementById("labelConfPassword")
        let inputConfPass = document.getElementById("confPassword")
        onConsulta = true
        e.preventDefault()
        let data = {
            id: e.target.user.value + e.target.user.value,
            User: e.target.user.value,
            Email: e.target.email.value,
            confEmail: e.target.confEmail.value,
            Password: e.target.password.value,
            confPassword: e.target.confPassword.value
        }
        console.log(data);

        // Validacines para agragar el nuevo usuario
        try {
            // la promesa retorna true o false
            let rtaPromesa = await validateUser(data.User, data.Email)

            if (rtaPromesa && data.Email === data.confEmail && data.Password === data.confPassword && data.User) {
                addUser(data);
                form.reset()
                location.href="http://127.0.0.1:5500/login.html"
            }
            if (data.Email !== data.confEmail) {
                labelEmail.className = "error"
                labelConfEmail.className = "error"
                inputConfEmail.value = ""
                inputConfEmail.placeholder = "Correo no coinciden"
            } else {
                labelEmail.className = ""
                labelConfEmail.className = ""
                inputConfEmail.placeholder = "Confirmar Correo"
            }
            if (data.Password !== data.confPassword) {
                labelPassword.className = "error"
                labelConfPassword.className = "error"
                inputConfPass.value = ""
                inputConfPass.placeholder = "Contraseña no coinciden"
            } else{
                labelPassword.className = ""
                labelConfPassword.className = ""
                inputConfPass.placeholder = "Confirmar Contraseña"
            }

        }
        catch (error) {
            console.log({
                mensaje:"User already exists, check email and username",
                error
            });
            onConsulta = false
        }
    })
}
else{
    throw new Error("La base de datos no ha sido creada")
}