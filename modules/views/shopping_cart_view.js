
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
        
        //Listeners for emptying cart or proceeding to checkout
        this.shadowRoot.addEventListener("click", (evt) => {
            if (evt.target.id === "btnGoToCheckout") {
                this.checkoutView.refresh(this.cart);
                viewContainer.innerHTML = "";
                viewContainer.appendChild(this.checkoutView);
            }

            else if (evt.target.id === "btnEmptyCart") {
                this.cart.emptyCart();
                this.refresh(this.cart, this.checkoutView);
            }
        });
    }
    
    //---------------------------------------
    refresh(cartInput, checkoutView) {
        
        this.cart = cartInput; //tar inn cart-arrayen som parameter
        this.checkoutView = checkoutView;
        this.listContainer.innerHTML = "";
        let sum = 0;
        
        cartInput.cartArray.forEach((item, index) => {

            if (!item.quantity) {
                item.quantity = 1;
            }

            const divCart = document.createElement("div");
            divCart.innerHTML = `
                <h3>${item.chocoName}</h3>
                <p>ID: ${item.chocoID}</p>
                <p>Quantity: <input type="number" value="${item.quantity}" min="1" max="99" id="itemQuantity-${index}"> ${item.price * item.quantity},-</p>
                <button id="btnDeleteProduct-${index}">Delete Product</button>
                <hr>
            `;

            sum += parseInt(item.price) * parseInt(item.quantity);
            this.listContainer.appendChild(divCart);

            //Increases amount
            const quantityInput = divCart.querySelector(`#itemQuantity-${index}`);
            quantityInput.addEventListener("input", (evt) => {
                const newQuantity = parseInt(evt.target.value);
                cartInput.updateQuantity(index, newQuantity);
                this.refresh(cartInput, checkoutView);
            });

            //Delete button listener
            const deleteButton = divCart.querySelector(`#btnDeleteProduct-${index}`);
            deleteButton.addEventListener("click", () => {
                cartInput.deleteItem(index);
                this.refresh(cartInput, checkoutView);
            });
        });

        //Cart summary
        const divCartBottom = document.createElement("div");
        divCartBottom.innerHTML = `
            <p>Sum: ${sum + ",-"}</p>
            <button id="btnEmptyCart">Empty Shopping Cart</button>
            <button id="btnGoToCheckout">Proceed to Checkout</button>
        `;
        this.listContainer.appendChild(divCartBottom);
    }

} //end of class


customElements.define("shopping-cart-view", ShoppingCartView);