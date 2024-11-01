import { dialog } from './main.js';

//-------------------------------------------------------------
export function messageHandler(title, msg) {

    // show messages here, e.g. show a dialog with an easy-to-understand message

    let html = `
        <h1> ${title}</h1>
        <p>${msg}</p>
        <button id="btnDialogClose">Ok</button>
    `

    dialog.innerHTML = html;

    const btnDialogClose = document.getElementById("btnDialogClose")
    dialog.showModal();

    btnDialogClose.addEventListener("click", () => {
        dialog.close()
    })
    
    // Skal få en dialog handler her som skal behandle input, skal vise dialog herfra og vise den.

}