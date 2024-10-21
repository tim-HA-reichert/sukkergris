
const html = `
    <h2>Administration of products</h2>
    <div id="listContainer"></div>
`;


//===================================================
export class AdminProductView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.listContainer = this.shadowRoot.getElementById("listContainer");
    }

    //---------------------------------------
    async refresh(dataPromise) {        
        
        const data = await dataPromise; //wait for the promise to be resolved

        this.listContainer.innerHTML = "";

/*         for (let value of data) {

            const theDiv = document.createElement("div");
            theDiv.innerHTML = `
                <h3>${value.dummyName}</h3>
                <p>${value.price}</p>
                <hr>
            `;

            this.listContainer.appendChild(theDiv);

            theDiv.addEventListener('click', evt => {
                const theEvent = new CustomEvent("dummyselect", {composed: true, bubbles:true, detail: value});
                this.dispatchEvent(theEvent);
                
            }); 

        } //end for-loop*/
    }

} //end of class


customElements.define("admin-product-view", AdminProductView);