
const html = `
<link rel="stylesheet" href="styles/shopping_cart_view_style.css">
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
        
        //Lyttere for å gå til checkout og før å tømme handlekurv
        this.shadowRoot.addEventListener("click", (evt) => {

            if (evt.target.id === "btnGoToCheckout") {
                const checkoutEvent = new CustomEvent("go-to-checkout",
                    {composed: true, bubbles: true, detail:evt});

                this.dispatchEvent(checkoutEvent);
                
            } else if (evt.target.id === "btnEmptyCart") {
                this.cart.emptyCart();
                this.refresh(this.cart);
            }
        });
    }
    
    //---------------------------------------
    refresh(cartInput) {
        
        this.cart = cartInput; //tar inn cart-arrayen som parameter

        this.listContainer.innerHTML = "";
        let sum = 0;
        

        cartInput.cartArray.forEach((item, index) => {
//Denne forEach-løkken ser sånn her ut som en for.. of: 
//for (const [index, item] of this.cart.cartArray.entries())

            if (!item.quantity) {
                item.quantity = 1;
            }

            const divCart = document.createElement("div");
            divCart.innerHTML = `
                <h3>${item.chocoName}</h3>
                <p>ID: ${item.chocoID}</p>
                <p>Quantity: <input type="number" value="${item.quantity}" min="1" max="99" id="itemQuantity-${index}"> ${item.price * item.quantity},-</p>
                <div class="btn-container">
                    <button class="btnDelProduct" id="btnDeleteProduct-${index}">Remove Item</button>
                </div>
                <hr>
            `;

            sum += parseInt(item.price) * parseInt(item.quantity);
            this.listContainer.appendChild(divCart);

            //Øk mengde produkter i kurv
            const quantityInput = divCart.querySelector(`#itemQuantity-${index}`);
            quantityInput.addEventListener("input", (evt) => {
                const newQuantity = parseInt(evt.target.value);
                cartInput.updateQuantity(index, newQuantity);
                //Tegner handlekurv på nytt
                this.refresh(cartInput);
            });

            //Fjern produkter fra kurv
            const deleteButton = divCart.querySelector(`#btnDeleteProduct-${index}`);
            deleteButton.addEventListener("click", () => {
                cartInput.deleteItem(index);
                this.refresh(cartInput);
            });
        });

        //Handlekurv oppsummering
        const divCartBottom = document.createElement("div");
        divCartBottom.innerHTML = `
            <p>Sum: ${sum + ",-"}</p>
            <button id="btnEmptyCart">Empty Shopping Cart</button>
            <button id="btnGoToCheckout">Proceed to Checkout</button>
        `;
        this.listContainer.appendChild(divCartBottom);
    }

} //Slutten av klassen


customElements.define("shopping-cart-view", ShoppingCartView);