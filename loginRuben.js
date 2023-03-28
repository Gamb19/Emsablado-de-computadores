const indexedDB = window.indexedDB
const form = document.getElementById("form")

if (indexedDB && form) {
    let db
}else{
    throw new Error("La base de datos no ha sido creada")
}