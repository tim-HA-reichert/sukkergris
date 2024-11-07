//import { dialog } from './main.js';
import { MessageView } from "./views/message_view.js";

const messageDialog = new MessageView();
document.body.appendChild(messageDialog);

//-------------------------------------------------------------
export function messageHandler(title, msg) {

    // show messages here, e.g. show a dialog with an easy-to-understand message

    let html = `
        <h1> ${title}</h1>
        <p>${msg}</p>
    `
    messageDialog.typeOfMessage(html);
}