
const html = `
    <h2>Product Details</h2>
    <div id="listContainer"></div>
`;


//===================================================
export class DetailedProductView extends HTMLElement {

    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = html;
        this.listContainer = this.shadowRoot.getElementById("listContainer");
    }

    //---------------------------------------
    async refresh(dataPromise) {

        const data = await dataPromise; //wait for the promise to be resolved

        console.log(data);
        this.listContainer.innerHTML = "";
        const theDiv = document.createElement("div");
        theDiv.innerHTML = `
                <h1>${data.chocoName}</h1>
                <h3>${data.heading}</h3>
                <h3>${data.categoryName}</h3>
                <img src="${data.image}">
                <h1> HUSK discount </h1>
                <h3>${data.description}</h3>
                <p>${data.price},- kr</p>
                <p>${data.stock}</p>
                <p>${data.expected_shipped}</p>
                <p> Customer rating: </p>
                <hr>
            `;

        this.listContainer.appendChild(theDiv);

        //     // theDiv.addEventListener('click', evt => {
        //     //     const theEvent = new CustomEvent("dummyselect", {composed: true, bubbles:true, detail: value});
        //     //     this.dispatchEvent(theEvent);
        //     //     console.log("detailed Product View");
    }

} //end of class


customElements.define("detailed-product-view", DetailedProductView);