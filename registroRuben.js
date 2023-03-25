const indexedDB = window.indexedDB
const form = document.getElementById("form")

function registroUser() {
    if (indexedDB && form) {
        let db
        const req = indexedDB.open("register",1)
    
        // Base de datos
        req.onsuccess = ()=>{
            db = req.result
            console.log("OPEN",db);
        }
    
        // Almacen de la base de datos
        req.onupgradeneeded = ()=>{
            db = req.result
            console.log("Create",db);
            db.createObjectStore("User",{
                keyPath:"User"
            })
        }

        // Agregar usuarios
        const addUser = (data)=>{
            const transaction = db.transaction(['User'],'readwrite')
            const objectStore = transaction.objectStore('User')
            objectStore.add(data)
        }

        const readData = (userInput)=>{
            const transaction = db.transaction(['User'])
            const objectStore = transaction.objectStore('User')
            const req = objectStore.openCursor()
            const labelUser = document.getElementById("labelUser")
            const inputUser = document.getElementById("user")

            req.onsuccess = (e)=>{
                const cursor = e.target.result

                if (cursor) {
                    let userId = cursor.value.User
                    cursor.continue()
                    if (userId === userInput) {
                        throw new Error(
                            labelUser.className = "error",
                            inputUser.placeholder = "El usuario ya existe",
                            form.user.value = ""
                        )
                    }
                    else {
                        labelUser.className = ""
                        inputUser.placeholder = "Usuario"
                    }
                }
            }
            req.onerror = (e) =>{
                console.log(e);
            }
        }

        req.onerror = (error)=>{
            console.log("Error", error);
        }

        // Evento del formulario
        form.addEventListener("submit",(e)=>{
            let labelEmail = document.getElementById("labelEmail")
            let labelConfEmail = document.getElementById("labelConfEmail")
            let inputConfEmail = document.getElementById("confEmail")
            let labelPassword = document.getElementById("labelPassword")
            let labelConfPassword = document.getElementById("labelConfPassword")
            let inputConfPass = document.getElementById("confPassword")
            e.preventDefault()
            data = {
                User: e.target.user.value,
                Email: e.target.email.value,
                confEmail: e.target.confEmail.value,
                Password: e.target.password.value,
                confPassword: e.target.confPassword.value
            }
            readData(data.User)
            if (data.Email === data.confEmail && data.Password === data.confPassword && data.User) {
                addUser(data);
                return false
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
        })
    }
}

registroUser()