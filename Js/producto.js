const indexedDB = window.indexedDB;

if (indexedDB) {
    console.log("sirviendo js");
    let db;
    let emailUserId; 
    let dataPC; 
  
    const req = indexedDB.open("Users", 1);
  
    req.onerror = (event) => {
      console.log("Error al abrir la base de datos", event.target.errorCode);
    };
  
    req.onsuccess = (event) => {
      db = event.target.result;
      console.log("Base de datos abierta correctamente", db);
      readLogin();
    };
  
    req.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains("LogIn")) {
        db.createObjectStore("LogIn", { keyPath: "Email" });
      }
      if (!db.objectStoreNames.contains("UserPC")) {
        db.createObjectStore("UserPC", { keyPath: "Id" });
      }
    };
  
    const readLogin = () => {
      const transaction = db.transaction(["LogIn"], "readonly");
      const objectStore = transaction.objectStore("LogIn");
      const req = objectStore.openCursor();
  
      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          readUserPC(cursor.value.Email, (array) => {
            emailUserId = cursor.value.Email; // Asignar el valor del correo electrónico
            dataPC = array; // Asignar el valor de dataPC
            console.log("Email del usuario:", emailUserId);
            console.log("Data PC:", dataPC);
            printData(dataPC);
            readUsers(emailUserId)
          });
        }
      };
  
      req.onerror = (event) => {
        console.log("Error al leer la tienda de objetos 'LogIn'", event.target.errorCode);
      };
    };
  
    const readUserPC = (emailUser, callback) => {
      const transaction = db.transaction(["UserPC"], "readonly");
      const objectStore = transaction.objectStore("UserPC");
      const req = objectStore.openCursor();
  
      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && cursor.value.Id === emailUser) {
          const dataPC = cursor.value.dataPC;
          console.log("Data PC del usuario:", dataPC);
          callback(dataPC);
        } else {
          cursor.continue();
        }
      };
  
      req.onerror = (event) => {
        console.log("Error al leer la tienda de objetos 'UserPC'", event.target.errorCode);
      };
    };
  
    function deleteUserPC(rowIndex) {
        const transaction = db.transaction(["UserPC"], "readwrite");
        const objectStore = transaction.objectStore("UserPC");
        const req = objectStore.openCursor();
      
        req.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            const data = cursor.value;
            if (data.Id === emailUserId) {
              const updatedData = { ...data }; // Crear una copia del objeto de datos
              updatedData.dataPC.splice(rowIndex, 1); // Eliminar el array de componentes en la posición rowIndex
      
              const updateRequest = cursor.update(updatedData); // Actualizar el registro con los datos modificados
              updateRequest.onsuccess = () => {
                console.log("Array de componentes eliminado correctamente");
              };
              updateRequest.onerror = (event) => {
                console.error("Error al eliminar el array de componentes:", event.target.error);
              };
            } else {
              cursor.continue();
            }
          }
        };
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
console.log("Imprimiendo Data PC:");

function printData(dataPC) {
    console.log("Imprimiendo Data PC:", dataPC);
  
    let tableBody = document.getElementById("listaUser");
    tableBody.innerHTML = ""; // Limpiar el contenido previo de la tabla
  
    dataPC.forEach((item, index) => {
      let row = document.createElement("tr");
  
      // Marca
      let marcaCell = document.createElement("td");
      marcaCell.colSpan = "3";
      marcaCell.textContent = item[0];
      row.appendChild(marcaCell);
  
      // Procesador
      let procesadorCell = document.createElement("td");
      procesadorCell.colSpan = "3";
      procesadorCell.textContent = item[1];
      row.appendChild(procesadorCell);
  
      // Almacenamiento
      let almacenamientoCell = document.createElement("td");
      almacenamientoCell.colSpan = "3";
      almacenamientoCell.textContent = item[2];
      row.appendChild(almacenamientoCell);
  
      // Motherboard
      let motherboardCell = document.createElement("td");
      motherboardCell.colSpan = "3";
      motherboardCell.textContent = item[3];
      row.appendChild(motherboardCell);
  
      // Fuente de poder
      let fuentePoderCell = document.createElement("td");
      fuentePoderCell.colSpan = "3";
      fuentePoderCell.textContent = item[4];
      row.appendChild(fuentePoderCell);
  
      // Case
      let caseCell = document.createElement("td");
      caseCell.colSpan = "3";
      caseCell.textContent = item[5];
      row.appendChild(caseCell);
  
      // RAM
      let ramCell = document.createElement("td");
      ramCell.colSpan = "3";
      ramCell.textContent = item[6];
      row.appendChild(ramCell);
  
      let accionesCell = document.createElement("td");
  
      accionesCell.className = "nav-item";
  
      let btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      accionesCell.appendChild(btnEliminar);
      btnEliminar.className = "btn btn-secondary d-flex";
  
      // Agregar el controlador de eventos al botón "Eliminar"
      btnEliminar.addEventListener("click", () => {
        const rowIndex = row.getAttribute("data-index"); // Obtener el índice de la fila
        // Eliminar la fila de la tabla
        tableBody.removeChild(row);
        // Eliminar el registro de la base de datos
        deleteUserPC(rowIndex);
      });
  
      // Botón Editar
      let divBtns = document.createElement("div");
      divBtns.className = "d-flex";
      divBtns.insertAdjacentElement("beforeend", btnEliminar);
      accionesCell.insertAdjacentElement("beforeend", divBtns);
      row.appendChild(accionesCell);
  
      // Establecer el atributo data-index con el índice del elemento
      row.setAttribute("data-index", index);
  
      tableBody.appendChild(row);
    });
  }

  function cerrarSesion(db) {
    // Limpia toda la data los almacen logIn
    const transaction = db.transaction(['LogIn'],'readwrite')
    const objectStore = transaction.objectStore('LogIn')
    objectStore.clear()
    location.href="http://127.0.0.1:5500/index.html"
}
