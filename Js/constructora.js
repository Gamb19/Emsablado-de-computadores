const indexedDB = window.indexedDB
let divImg;
let allSelectedValues = [];

//¬ Se declaro globalmente para poder hacer uso de ella mas facilmente
let selectedOption;
let handleSelectChange = ()=>{};
let emailUserId;

function runBD(addPc = false, dataPC = null) {

    if (indexedDB) {
        let db;
        let userPCArray = []; // Variable para almacenar los datos de UserPC
      
        const req = indexedDB.open("Users", 1);
      
        // Base de datos
        req.onsuccess = () => {
          db = req.result;
          console.log("OPEN", db);
          readComponents();
          if (addPc && dataPC) addUserPC(); // Cuando se da submit
          else readLogin(); // Solo cuando se carga la pagina
        };
      
        // Agregar PC del Usuario
        const addUserPC = () => {
          const dataPushBD = {
            Id: emailUserId,
            dataPC
          };
      
          const transaction = db.transaction(['UserPC'], 'readwrite');
          const objectStore = transaction.objectStore('UserPC');
          const deleteRequest = objectStore.delete(emailUserId); // Limpia el almacenamiento
          const updateRequest = objectStore.add(dataPushBD); // Agrega la data antigua con la nueva
          updateRequest.onerror = (event) => {
            console.log('Objeto Eliminado correctamente', event.target.error);
          };
          deleteRequest.onerror = (event) => {
            console.error('Error al Eliminar el objeto:', event.target.error);
          };

        };
      
        // Si hay un usuario ya logiado, lo redirige a la pagina principal
        let userLoggedIn = false;
      
        const readComponents = () => {
          const transaction = db.transaction(["Components"]);
          const objectStore = transaction.objectStore("Components");
          const req = objectStore.openCursor();
      
          req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              printData(cursor.value);
              userLoggedIn = true;
            } else {
              userLoggedIn = false;
            }
            console.log(`Usuario logeado: ${userLoggedIn}`); // imprimir si se logea un usuario
          };
          req.onerror = (e) => {
            console.log(e);
          };
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
              readUserPC(cursor.value.Email);
              emailUserId = cursor.value.Email;
              readUsers(emailUserId)
            }
          };
          req.onerror = (e) => {
            console.log(e);
          };
        };
        
        // Se lee el almacen de UserPC para traer la data del PC guardado
        const readUserPC = (emailUser) => {
          const transaction = db.transaction(["UserPC"]);
          const objectStore = transaction.objectStore("UserPC");
          const req = objectStore.openCursor();
          req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor && cursor.value.Id === emailUser) {
                // Traigo la data en el almacenamiento sobre las PC armadas
                const existingData = cursor.value.dataPC
                // Pusheo la data del almacenamiento a la varible global de los PC
                allSelectedValues.push(...existingData)

                // Actualizar el array userPCArray con los datos existentes
                const dataIndex = userPCArray.findIndex((data) => data.Id === emailUser);
                if (dataIndex !== -1) {
                  userPCArray[dataIndex] = cursor.value;
                } else {
                  userPCArray.push(cursor.value);
                }
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
}

function cleanAllDivs() {
    const divs = document.querySelectorAll("[id^='div-']"); // selecciona todos los elementos cuyo id comienza con 'div-'
    divs.forEach(div => {
      div.style.backgroundImage="" // elimina la imagen de fondo de cada div
    });
  }
function printData(data) {
     // limpia todos los divs al cambiar de marca
    const { Intel, Ryzen } = data;

    let selectMarca = document.getElementById('select-marca');
    selectMarca.addEventListener('change', (e) => {
      if (e.target.value === 'Intel') {
        let data = Object.entries(Intel);
        deleteEvent(data);
        printOptions(data, e.target.value); // (e.target.value) -> Brand name
        cleanAllDivs();
      } else {
        const data = Object.entries(Ryzen);
        deleteEvent(data);
        printOptions(data, e.target.value); // (e.target.value) -> Brand name
        cleanAllDivs();
      }
      selectedOption = e.target.value; // actualiza la opción seleccionada previamente
    });
  }
 
function deleteEvent(data) {
    data.forEach(element => {
        const select = document.getElementById(`select-${element[0]}`)
        // (handleSelectChange) esta declarada globalmente al incio del codigo
        select.removeEventListener("change", handleSelectChange)
    })
}

function printOptions(data, marca) {

    // El nombre de las (key) de cada (marca) debe ser igual al (id) de cada (select)
    // La separacion de cada palabra de un id o key tiene que ser con un ( _ )
    /* MarcaIntel: {
        key1:"",
        key2:""
        }
    */

    // Funcion para poder hacer el (select.removeEventListener)
    handleSelectChange = (elem) => {
        getImageUrl(elem, marca);
    }

    data.forEach(element => {

        // element[0] -> son las key de cada marca
        // algunas key viene separadas con ( _ )
        // element[1] -> Es la data de cada option (key)

        const select = document.getElementById(`select-${element[0]}`)
        select.addEventListener('change', handleSelectChange)

        select.innerHTML = "" //Se limpia los selects
        const option = document.createElement('option') // Se crean de nuevo las opciones principales
        option.setAttribute = 'selected'
        option.textContent = element[0].replace(RegExp(/_/g),' ') // Remplazamos los ( _ ) por espacios en blanco
        select.insertAdjacentElement('beforeend',option)

        // console.log(element[0].replace(RegExp(/_/g),' '))

        element[1].forEach(nameOption => {
            // Se crean las opciones de cada select
            let option = document.createElement('option')
            option.value = nameOption
            option.textContent = nameOption
            select.insertAdjacentElement('beforeend',option)
        })

    });

}

async function getImageUrl (e, keyMarca) {

    // Los id de cada select tienen concatenado el texto ("select-") + propertyName
    // En este caso solo se necesita el (propertyName) para eso se uso el (replace)
    const keyPropiedad = e.target.id.replace('select-','')
    const keyUrl = e.target.value

    // Se hizo el llamado de la data que esta en (Images_Component.json)
    const resp = await fetch("../Images_Component.json")
    const data = await resp.json()

    // Se extrajo la data de cada key obtenida por los parametros
    const valueMarca = data[ keyMarca ]
    const valuePropiedad = valueMarca[ keyPropiedad ]
    const urlImg = valuePropiedad[ keyUrl ]

    updateImg(keyPropiedad, urlImg)
    // window.scrollTo(1, 1);
}
function updateImg(idDiv, urlImg) {
    divImg = document.getElementById(`div-${idDiv}`)
    divImg.style.backgroundImage = `url('../${urlImg}')`;
    divImg.style.transition="background-image 3s ease";
}

function cerrarSesion(db) {
    // Limpia toda la data los almacen logIn
    const transaction = db.transaction(['LogIn'],'readwrite')
    const objectStore = transaction.objectStore('LogIn')
    objectStore.clear()
    location.href="http://127.0.0.1:5500/index.html"
}

let form= document.getElementById("formSelect")
let submit = document.getElementById("submit")
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    const selects = document.querySelectorAll('select');
    const selectedValues = [];
  
    selects.forEach((select) => {
      const selectedValue = select.value;
      selectedValues.push(selectedValue);
    });
  
    allSelectedValues.push(selectedValues);

    runBD(true, allSelectedValues)
  
    form.reset();
    cleanAllDivs();
  });


let bckImg = document.getElementById("form-select-section");
bckImg.style.backgroundImage ="url(../images/core-i9.png), url(../images/ryzen.png)";
bckImg.style.backgroundRepeat="no-repeat";
bckImg.style.backgroundSize=("783px 700px, 783px 600px");
bckImg.style.backgroundPosition=(" -293px 80px, 951px 220px ");


runBD()