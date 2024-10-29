
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
    async refresh(dataPromise) { // DataPromise er et class object med item.

        const itemObject = await dataPromise; //wait for the promise to be resolved
        this.listContainer.innerHTML = "";
        const theDiv = document.createElement("div");

        theDiv.innerHTML = `
                <h1>${itemObject.chocoName}</h1>
                <h3>${itemObject.heading}</h3>
                <h3>${itemObject.categoryName}</h3>
                <img src="${itemObject.image}">
                <h1> HUSK discount </h1>
                <h3>${itemObject.description}</h3>
                <p>Price: ${itemObject.price},- kr</p>
                <button id="btnAddItem">Buy this item</button>
                <p>${itemObject.stock}</p>
                <p> ${itemObject.expected_shipped}</p>

                
            `;
        if (itemObject.number_of_ratings > 0) {
            theDiv.innerHTML += `<p> Customer rating: ${itemObject.rating} </p>`
        }

        this.listContainer.appendChild(theDiv);

        const btnAddItem = this.shadowRoot.getElementById("btnAddItem");
        if (itemObject.stock === "Out of stock") {
            btnAddItem.style.display = "none"
        }

        btnAddItem.addEventListener('click', evt => {
            const theEvent = new CustomEvent("addItem", { composed: true, bubbles: true, detail: itemObject });
            this.dispatchEvent(theEvent);
        })
    }

} //end of class


customElements.define("detailed-product-view", DetailedProductView);