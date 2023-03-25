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
                // autoIncrement:true
                keyPath:"User"
            })
        }

        // Agregar usuarios
        const addData = (data)=>{
            const transaction = db.transaction(['User'],'readwrite')
            const objectStore = transaction.objectStore('User')
            const req = objectStore.add(data)
        }

        req.onerror = (error)=>{
            console.log("Error", error);
        }

        // Evento del formulario
        form.addEventListener("submit",(e)=>{
            e.preventDefault()
            data = {
                User: e.target.user.value,
                Email: e.target.email.value,
                confEmail: e.target.confEmail.value,
                Password: e.target.password.value,
                confPassword: e.target.confPassword.value
            }
            addData(data);
            form.reset();
        })
    }
}

registroUser()