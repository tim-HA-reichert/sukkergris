const html = `
<link rel="stylesheet" href="styles/chocolate_list_view_style.css">
    <h2>The Products</h2>
    <div id="listContainer"></div>
`;


//===================================================
export class ChocolateListView extends HTMLElement {    
    
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
                <img src="${value.thumb}"/>
                <h3>${value.chocoName}</h3>
                <p>${value.price},-</p>
            `;

            this.listContainer.appendChild(theDiv);

            theDiv.addEventListener('click', evt => {
                const chocolateDetailEvent = new CustomEvent("chocolateselect", {composed: true, bubbles:true, detail: value});
                this.dispatchEvent(chocolateDetailEvent);
            });

        } //end for-loop
    }

} //end of class


customElements.define("chocolate-list-view", ChocolateListView);