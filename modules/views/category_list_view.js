
const html = `
    <h2>Categories</h2>
    <div id="listContainer"></div>
`;


//===================================================
export class CategoryListView extends HTMLElement {    
    
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

        for (let value of data) {

            const theDiv = document.createElement("div");
            theDiv.innerHTML = `
                <h3>${value.categoryID} ${value.categoryName}</h3>
                <p>${value.description}</p>
                <hr>
            `;

            this.listContainer.appendChild(theDiv);

            theDiv.addEventListener('click', evt => {
                const theEvent = new CustomEvent("categoryselect", {composed: true, bubbles:true, detail: value});
                this.dispatchEvent(theEvent);
            });
            
        } //end for-loop
    }

} //end of class


customElements.define("category-list-view", CategoryListView);