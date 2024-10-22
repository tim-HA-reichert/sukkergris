
const html = `
    <h2>Dummy products</h2>
    <div id="listContainer"></div>
`;


//===================================================
export class DummyListView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.listContainer = this.shadowRoot.getElementById("listContainer");
    }

    //---------------------------------------
    async refresh(dataPromise) {        
        this.listContainer.innerHTML = "";

        const data = await dataPromise; //wait for the promise to be resolved

        for (let value of data) {

            const theDiv = document.createElement("div");
            theDiv.innerHTML = `
                <h3>${value.chocoName}</h3>
                <p>${value.price}</p>
                <hr>
            `;

            this.listContainer.appendChild(theDiv);

            theDiv.addEventListener('click', evt => {
                const theEvent = new CustomEvent("dummyselect", {composed: true, bubbles:true, detail: value});
                this.dispatchEvent(theEvent);
                console.log(evt);
            });

        } //end for-loop
    }

} //end of class


customElements.define("dummy-list-view", DummyListView);