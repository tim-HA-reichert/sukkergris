import { dialog } from './main.js';

//-------------------------------------------------------------
export function errorHandler(error) {

    let errorMessage = ""
    
    switch(error.cause.http_code){
        case 400:
        errorMessage = "Please check your input."
        break
        case 403: 
        errorMessage = "Wrong username or password, please try again."
        break
        case 500: 
        errorMessage = "Wrong groupkey"
        break
        default:        
        errorMessage = error.cause.msg
    }   
    
    let html = `
    <h1>Error occurred</h1>
    <p>${errorMessage}</p>
    <button id="btnDialogClose">Ok</button>
    `    

    dialog.innerHTML = html;
    const btnDialogClose = document.getElementById("btnDialogClose")
    dialog.showModal();
    
    btnDialogClose.addEventListener("click", () => {
        dialog.close()
    })
    
    // handle errors here, e.g. show a dialog with an easy-to-understand explanation
    // based on the error type/code.
    
    console.log(error.cause);
    
}