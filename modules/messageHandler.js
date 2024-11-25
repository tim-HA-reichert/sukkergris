import { SystemMessageView } from "./views/system_message_view.js";

const messageDialog = new SystemMessageView();
document.body.appendChild(messageDialog);

//-------------------------------------------------------------
export function messageHandler(title, msg) {

    // show messages here, e.g. show a dialog with an easy-to-understand message
    let html =``;

    if(msg){
        html=`<h1> ${title}</h1>
        <p>${msg}</p>
        `
    } else {
    html =`<h1> ${title}</h1>`
    }

    messageDialog.typeOfMessage(html);
}