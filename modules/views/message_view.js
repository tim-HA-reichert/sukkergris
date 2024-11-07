let html = `
    <dialog id="dialog">
        <div id="message-container"> </div> 
        <button id="btnDialogClose">Ok</button>
    </dialog>
`
export class MessageView extends HTMLElement {

    constructor(){

        super();

        this.attachShadow({mode:"open"});
        this.shadowRoot.innerHTML = html;

        this.dialog = this.shadowRoot.getElementById("dialog");
        this.message = this.shadowRoot.getElementById("message-container");
        this.closeBtn = this.shadowRoot.getElementById("btnDialogClose");

        this.closeBtn.addEventListener("click", (e) => {
            this.dialog.close()
           });
        }

    typeOfMessage(aMessage) {
        this.message.innerHTML = aMessage;
        this.dialog.showModal();
    }  
}
customElements.define("message-view", MessageView);