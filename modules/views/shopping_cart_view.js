
const html = `
    <h2>Shopping Cart</h2>
    <div id="listContainer"></div>
`;


//===================================================
export class ShoppingCartView extends HTMLElement {    
    
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

        //Clearer itemPrice og sum
        let itemPrice = 0;
        let sum = 0;
        let amount = 0;

        //Pris settes egentlig av det jeg får av Eskil
        itemPrice = 32;
        sum = sum += itemPrice;
        amount = 2;

        //Her blir det egentlig en for x og y-løkke som går
        //igjennom arrayen til Eskil
        const divOrderTest = document.createElement("div");
        divOrderTest.innerHTML = `
        <h3>Banana Bug Bonanza (test)</h3>
        <p>01011010101010</p>
        <p>Quantity: <input type="number" value="1" id="itemQuantity"> ${itemPrice * amount},-</p>
        <hr>
        <p>Sum: ${sum * amount},-</p>
        <button id="btnEmptyCart">Empty Shopping Cart</button>
        `;
        console.log("Added Banana Bug Bonanza");

        this.listContainer.appendChild(divOrderTest);



        /* for (let value of data) {

            //Her skal vi vise all innholdet i
            //ShoppingCartItems (array)

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
                console.log("Test 2");
                
            });

        } */ //end for-loop
    }

} //end of class


customElements.define("shopping-cart-view", ShoppingCartView);