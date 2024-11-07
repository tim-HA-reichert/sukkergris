
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
    refresh(cartInput) {
        
        const cart = cartInput; //wait for the promise to be resolved
        
        this.listContainer.innerHTML = "";
        
        let sum = 0;
        
        for (let value of cart.cartArray) {
            const divCart2 = document.createElement("div");
            divCart2.innerHTML = `
            <h3>${value.chocoName}</h3>
            <p>ID: ${value.chocoID}</p>
            <p>Quantity: <input type="number" value="1" id="itemQuantity"> ${value.price},-</p>
            <button id="btnDeleteProduct">Delete Product</button>
            <hr>
            `;
            sum += parseInt(value.price);
            this.listContainer.appendChild(divCart2);
        }

        const divCartBottom = document.createElement("div");
        divCartBottom.innerHTML =`
        <p>Sum: ${sum + ",-"}</p>
        
        <button id="btnEmptyCart">Empty Shopping Cart</button>
        <button id="btnGoToCheckout">Proceed to Checkout</button>
        `;
        this.listContainer.appendChild(divCartBottom);
        this.btn = this.shadowRoot.getElementById("btnEmptyCart");
        
        this.btn.addEventListener("click", evt => {
            cart.emptyCart();
            this.listContainer.innerHTML = "";
        });
    }

} //end of class


customElements.define("shopping-cart-view", ShoppingCartView);