const indexedDB = window.indexedDB;

if (indexedDB) {
  let db;
  const req = indexedDB.open("Users", 1);

  req.onsuccess = () => {
    db = req.result;
    console.log("OPEN", db);
    readLogin();
  };

  // Se lee el almacen de login para traer la data del usuario
  const readLogin = () => {
    const transaction = db.transaction(["LogIn"]);
    const objectStore = transaction.objectStore("LogIn");
    const req = objectStore.openCursor();

    // Si existe un usuario ya ingresado, ejecuta la funcion correspondiente
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        emailUserId = cursor.value.Email;
        readUsers(emailUserId)
      }
    };
    req.onerror = (e) => {
      console.log(e);
    };
  };

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

function searchTable() {
    const searchInput = document.getElementById('form1').value.toLowerCase();
    const table = document.getElementById('table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      let found = false;

      for (let j = 0; j < cells.length; j++) {
        const cellText = cells[j].textContent.toLowerCase();

        if (cellText.includes(searchInput)) {
          cells[j].innerHTML = cellText.replace(new RegExp(searchInput, 'gi'), match => `<span class="highlight">${match}</span>`);
          found = true;
        } else {
          cells[j].innerHTML = cellText;
        }
      }

      if (found) {
        rows[i].style.display = '';
      } else {
        rows[i].style.display = 'none';
      }
    }
  }
  
 
 