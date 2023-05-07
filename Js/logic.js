const indexedDB = window.indexedDB

// No cambiar la estructura del objeto ( componentes )
const componentes = {
    Id: 'Unico',

    Intel: {
      MothersBoards: [
        "ASUS PRIME H510M-E",
        "TUF GAMING B560M-E",
        "GIGABYTE H510M S2H V2 (rev. 1.0)",
      ],
      Procesadores: ["i5-11600", "I7-11700F", "i9-10900F"],
      Fuente_de_poder: [
        "XPG pylon 550W 80 plus bronze",
        "Cooler Master MWE 600W 80 Plus Bronze V2",
        "Aerocool Cylon Rgb 600w 80 Plus Bronze",
      ],
      Memoria_Ram: [
        "Corsair Vengeance RGB Pro 16GB DDR4 3200MHz",
        "TEAMGROUP T-Force Delta RGB DDR4 16GB 3200MHz",
        "PNY XLR8 Gaming 16GB DDR4 DRAM 3200MHz",
      ],
      Almacenamiento: [
        "WD_BLACK NVMe 500 GB Gen4 PCIe M.2 2280, hasta 4,000 MB/s ",
        "1TB Crucial P5 Plus PCIe Gen4 3D NAND NVMe M.2 Gaming SSD, hasta 6600MB/s",
        "SAMSUNG 980 PROM.2 NVMe Gen4 de 500 GB hasta 3500MB/s",
      ],
      Cases: [
        "Cooler Master MasterBox MB500",
        "Asus TUF GT301",
        "Corsair 5000D Airflow",
      ],
    },
  
    Ryzen: {
      MothersBoards: [
        "MSI A520M PRO",
        "MSI MPG B550 GAMING CARBON WIFI",
        "MSI MEG X570S UNIFY-X MAX",
        "MSI B450M MORTAR MAX",
        "GIGABYTE A320M HD3 (rev. 1.0)",
        "GIGABYTE GA-AX370M-Gaming 3 (rev. 1.x)",
        "GIGABYTE B450M S2H V2 (rev. 1.x)",
      ],
      Procesadores: [
        "Ryzen 5 5600G",
        "Ryzen 7 5700G",
        "Ryzen 3 5300G",
        "Athlon 3000G",
        "Ryzen 3 2200G",
        "Ryzen 5 2400G",
        "Ryzen 7 4700G",
      ],
      Fuente_de_poder: [
        "XPG pylon 650W 80 plus bronze",
        "Evga 700w 700 bq 80 Plus Bonze",
        "500w Thermaltake Smart 80 Plus White",
        "Giga-Byte Technology P650B 650W",
        "Cougar Vtc600 600w 80 + White",
        "Cooler Master 600w Elite V3",
        "Azza PSAZ-650W",
      ],
      Memoria_Ram: [
        "Teamgroup T-Force Vulcan TUF Gaming DDR4 16GB 3200MHz",
        "Corsair Vengeance LPX 16GB DDR4 3200MHz",
        "Silicon Power Value Gaming DDR4 RAM 16GB 3200MHz",
        "Kingston FURY 16 GB 2666 MHz DDR4",
        "Corsair Dominator Platinum RGB DDR4 3200MHz",
        "TEAMGROUP T-Force Zeus DDR4 16GB 3200MHz",
        "G.Skill Trident Z RGB Series 32GBDDR4 3600MHz",
      ],
      Almacenamiento: [
        "Crucial P3 Gen3 3D NAND NVMe M.2 de 1TB, hasta 3500 MB/s",
        "Western Digital NVMe 1TB WD Blue Gen3 x4, M.2 2280, hasta 3,500 MB/s",
        "Kingston NV2 500G M.2 2280 NVMe PCIe 4.0 Gen 4x4 Hasta 3500 MB/s",
        "PNY XLR8 500GB M.2 PCIe NVMe Gen3 x4",
        "PNY CS2140 500GB M.2 NVMe Gen4 x4 3600MHz",
        "WD_BLACK 1TB NVMe Gen4 PCIe, M.2 2280, hasta 5,150 MB/s",
        "1TB Kingston FURY Renegade PCIe Gen 4.0 NVMe M.2 500 GB Hasta 7300 MB/s",
      ],
      Cases: [
        "JYR JX103 DESTROYER",
        "Iceberg Flux Pro Rgb",
        "Cooler Master Masterbox Q300l",
        "Iceberg Glacius 2.0",
        "Aerocool Cyberx Advance",
        "Iceberg Flow X Argb",
        "Cooler Master Masterbox Td500 Mesh Black",
      ]
    },
};

function txtBienvenida() {
    if (indexedDB) {
        let db
        // Se crea la base de datos
        const req = indexedDB.open("Users",1)

        // Se abre la base de datos ya creada
        req.onsuccess = ()=>{
            db = req.result
            console.log("OPEN",db);
            readLogin()
            addComponents()
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
            }),
            db.createObjectStore("Components",{
                keyPath:"Id"
            })
        }

        // Agregar Componentes
        const addComponents = ()=>{
            const transaction = db.transaction(['Components'],'readwrite')
            const objectStore = transaction.objectStore('Components')
            objectStore.add(componentes)
        }

        // Se lee el almacen de login para saber que tipo de usuario ingreso
        const readLogin = ()=>{
            const transaction = db.transaction(['LogIn'])
            const objectStore = transaction.objectStore('LogIn')
            const req = objectStore.openCursor()
    
            // Si existe un usuario ya ingresado, ejecuta la funcion correspondiente
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

        // Si existe un usuario comun lee todos los usuario y lo compara con el ingresado
        const readUsers = (emailLogin)=>{
            const transaction = db.transaction(['signUp'])
            const objectStore = transaction.objectStore('signUp')
            const req = objectStore.openCursor()
            req.onsuccess = (e)=>{
                const cursor = e.target.result
                if (cursor) {
                    // Comparacion de usuarios
                    //JSX
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

                        ulMenu.insertAdjacentElement("beforeend",liMenu)
                        liMenu.insertAdjacentElement("beforeend",opcionMenu)
                        
                        const textoNameUser = document.getElementById("smsBienvenida")
                        textoNameUser.textContent ="Hola, "+ cursor.value.User
                    }
                    // Cuando pase por el primer usuario, continue con el recorrido
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
    // Limpia toda la data los almacen logIn
    const transaction = db.transaction(['LogIn'],'readwrite')
    const objectStore = transaction.objectStore('LogIn')
    objectStore.clear()
    location.href="http://127.0.0.1:5500/index.html"
}

function administracion(db) {
    let keyUser = ""
    let optionEjecutar = ""
    // El (divListaUser)  es donde se imprime todos los usuario registrados
    let divListaUser = document.getElementById("listaUser")
    // (addUser) es el boton para mostrar el form de agregar un usuario
    let addUser = document.getElementById("addUser")
    addUser.addEventListener("click",(e)=>{
        optionEjecutar = "AgregarUsuario"
        document.getElementById("btnEditar").textContent = "Agregar"
        formUpdate.className = ""
        formUpdate.reset()
    })
    // (formUpdate) es el formulario para editar y agregar un usuario
    let formUpdate = document.getElementById("formEditar")
    formUpdate.addEventListener("submit",(e)=>{
        formUpdateData(e)
    })
    
    // Funcion para imprimir los usuario en el (divListaUser)
    const printUsers = ()=>{
        const transaction = db.transaction(['signUp'], 'readwrite')
        const objectStore = transaction.objectStore('signUp')
        const req = objectStore.openCursor()
        divListaUser.innerHTML = ""

        req.onsuccess = (e)=>{
            const cursor = e.target.result
            // Si existe algun usuario, se guarda la data en el objeto (dataUser)
            // Para poder usarla en los eventos click y asi no perder la data en recorrido de la consulta
            if (cursor) {
                let dataUser = {
                    key: cursor.key,
                    user: cursor.value.User,
                    email:cursor.value.Email,
                    password:cursor.value.Password
                }
                let trSeparator = document.createElement("tr");
                let ulLista = document.createElement("tr")
                ulLista.className = "navbar-nav col-lg-11 listaAdmin"
                let liNameUser = document.createElement("td")
                liNameUser.className = "nav-item"
                liNameUser.colSpan=3;
                liNameUser.textContent = cursor.value.User
                let liEmail = document.createElement("td")
                liEmail.className = "nav-item"
                liEmail.textContent = cursor.value.Email
                liEmail.colSpan=3;
                let liPassword = document.createElement("td")
                liPassword.className = "nav-item"
                liPassword.textContent = cursor.value.Password
                liPassword.colSpan=3;

                let btnTd = document.createElement("td");
                btnTd.className="nav-item td-Btn"
                let btnEditar = document.createElement("button")
                btnEditar.className = "btn btn-secondary"
                btnEditar.textContent = "Editar"
                btnEditar.addEventListener("click",(e)=>{
                    document.getElementById("user").value = dataUser.user
                    document.getElementById("email").value = dataUser.email
                    document.getElementById("password").value = dataUser.password
                    document.getElementById("btnEditar").textContent = "Editar"
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

                // Se inserta el elemento ul (ulLista) en el div (divListaUser)
                // divListaUser.insertAdjacentElement("beforeend",ulLista)
                // Se inserta el resto de elemetos en la lista ul (ulLista)
                divListaUser.insertAdjacentElement("beforeend", trSeparator);
                trSeparator.insertAdjacentElement("beforeend",liNameUser)
                trSeparator.insertAdjacentElement("beforeend",liPassword)
                trSeparator.insertAdjacentElement("beforeend",liEmail)
                btnTd.insertAdjacentElement("beforeend",btnEditar);
                btnTd.insertAdjacentElement("beforeend",btnEliminar)
                trSeparator.insertAdjacentElement("beforeend",btnTd)
                

                // Cuando pase por el primer usuario, continue con el recorrido
                cursor.continue()
            }
        }

        req.onerror = (e) =>{
            console.log(e);
        }
    }

    // Al dar click en editar mostrara el formulario y al enviar se ejecutara esta funcion
    const updateDB = (dataForm)=>{
        const transaction = db.transaction(['signUp'], 'readwrite')
        const objectStore = transaction.objectStore('signUp')
        const req = objectStore.get(keyUser);

        // se trae la data de ese usuario y se remplaza por la del formulario
        req.onsuccess = (e)=>{
            const data = e.target.result
            if (data && optionEjecutar === "Editar") {
                data.Email = dataForm.Email
                data.User = dataForm.User
                data.Password = dataForm.Password
                data.confEmail = dataForm.Email
                data.confPassword = dataForm.Password

                // Si todo esta bien, vuelve y ejecuta printUsers() y oculta el formulario
                const updateRequest = objectStore.put(data);
                updateRequest.onsuccess = (event) => {
                    formUpdate.className = "displayNone"
                    printUsers()
                }
            }
            // Si se da click en eliminar, se ejecutara esta parte del codigo
            else if(data && optionEjecutar === "Eliminar"){
                const deleteRequest = objectStore.delete(keyUser);
                // Si todo esta bien, vuelve y ejecuta printUsers()
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

    // Si se desea agregar un nuevo usuario,
    // mostrara el formulario y al enviar ejecutara esta funcion
    const addNewUser = (data)=>{
        // Copio la data del formulario y le agrego los campos faltantes
        let dataNewUser = { ...data}
        dataNewUser.id = data.User+data.User
        dataNewUser.confEmail = data.Email
        dataNewUser.confPassword = data.Password

        const transaction = db.transaction(['signUp'],'readwrite')
        const objectStore = transaction.objectStore('signUp')
        objectStore.add(dataNewUser)
        printUsers()
        formUpdate.className = "displayNone"
    }

    const formUpdateData = (e)=>{
        e.preventDefault()
        let data = {
            User: e.target.user.value,
            Email: e.target.email.value,
            Password: e.target.password.value,
        }
        if (optionEjecutar === "AgregarUsuario") {
            addNewUser(data)
        }
        else updateDB(data)
    }

    // Lo Primero en ejecutarse en Administracion
    printUsers()
}

txtBienvenida()