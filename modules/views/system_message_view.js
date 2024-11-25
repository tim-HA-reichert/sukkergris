let html = `
<link rel="stylesheet" href="styles/system_message_view_style.css">
    <dialog id="dialog">
        <div id="dialog-content">
            <div id="message-container"> </div> 
            <button id="btnDialogClose">Close</button>
        </div> 
    </dialog>
`
export class SystemMessageView extends HTMLElement {

    constructor(){

        super();

        this.attachShadow({mode:"open"});
        this.shadowRoot.innerHTML = html;

        this.dialog = this.shadowRoot.getElementById("dialog");
        this.dialogContent = this.shadowRoot.getElementById("dialog-content");
        this.message = this.shadowRoot.getElementById("message-container");
        this.closeBtn = this.shadowRoot.getElementById("btnDialogClose");

        this.closeBtn.addEventListener("click", (e) => {
            this.dialog.close()
           });

        this.dialog.addEventListener("click", (e) => this.closeOnClick(e));
    
    }

        
    typeOfMessage(aMessage) {
        this.message.innerHTML = aMessage;
        this.dialog.showModal();
    }  

    closeOnClick(evt){
        if(evt.target === this.dialog){
            this.dialog.close();
        }
    }
}
customElements.define("system-message-view", SystemMessageView);