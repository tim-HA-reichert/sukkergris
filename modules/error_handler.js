import { SystemMessageView } from "./views/system_message_view.js";

//-------------------------------------------------------------
const messageDialog = new SystemMessageView();
document.body.appendChild(messageDialog);

export function errorHandler(error, customMessage) {
    let errorMessage = customMessage;

    if(!errorMessage){
    switch (error.cause.http_code) {
        case 400:
            errorMessage = "Please check your input.";
            break;
        case 403: 
            errorMessage = "Wrong username or password, please try again.";
            break;
        case 500: 
            errorMessage = "Wrong groupkey";
            break;
        default:        
            errorMessage = error.cause.msg;
    }
}
    let html = `
        <h1>Error occurred</h1>
        <p>${errorMessage}</p>
    `;
    
    messageDialog.typeOfMessage(html);
}
