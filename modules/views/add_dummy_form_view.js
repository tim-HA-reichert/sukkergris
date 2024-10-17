
const html = `    
    <h2>Add dummy product</h2>
    <hr>
    <form id="addDummyForm">
        <input name="name" placeholder="Product name"><br>
        <input name="description" placeholder="description"><br>
        <input name="category_id" placeholder="Category ID (1-7)"><br>
        <input name="details" placeholder="Details"><br>
        <input name="price" placeholder="Price"><br>
        <input name="thumb" type="file"><br><hr>
        
        <input type="submit" value="Add dummy product">
    </form>
`;


//===================================================
export class AddDummyFormView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("addDummyForm");

        this.form.addEventListener('submit', evt => {
            
            evt.preventDefault();           

            const fd = new FormData(this.form);            

            const theEvent = new CustomEvent("add-dummy", {composed: true, bubbles:true, detail: fd});
            this.dispatchEvent(theEvent);

        });
    }    

} //end of class


customElements.define("add-dummy-form-view", AddDummyFormView);