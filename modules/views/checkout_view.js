
const html = `
    <h2>Checkout</h2>



    <div id="checkoutFormContainer">
        <form id="checkoutForm" action="">
            <label for="name">Name:</label>
            <input required type="text" id="name" name="name"
            placeholder="Enter your full name">
            <br>

            <label for="email">Email:</label>
            <input required type="text" id="email" name="email"
            placeholder="Enter your email address">
            <br>

            <label for="streetAddress">Street address:</label>
            <input required type="text" id="streetAddress" name="streetAddress"
            placeholder="Enter your street address">
            <br>

            <label for="city">City:</label>
            <input required type="text" id="city" name="city"
            placeholder="Enter your city">
            <br>

            <label for="zip">ZIP code:</label>
            <input required type="text" id="zip" name="zip"
            placeholder="Enter your ZIP code">
            <br>

            <label for="country">Country:</label>
            <input required type="text" id="country" name="country"
            placeholder="Enter your country">
            <br>

            <label for="content">

            <div id="orderContentContainer"> </div>


            <input type="submit" value="Place Order">


        </form>
    </div>


    <div id="listContainer"></div>


    <dialog id="placeOrderDialog">
        <h2>Order placed!</h2>
        <p>Thank you for your order!
        Unfortunately, our developer hasn't yet figured out
        how to send orders to the server, so your order went
        straight into the void.</p>
        <button id="btnCloseDialog">Close</button>
    </dialog>
`;


//===================================================
export class CheckoutView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.listContainer = this.shadowRoot.getElementById("listContainer");
        this.placeOrderDialog = this.shadowRoot.getElementById("placeOrderDialog");

        this.form = this.shadowRoot.getElementById("checkoutForm");


        this.shadowRoot.addEventListener("click", (evt) => {
            if (evt.target.id === "btnPlaceOrder") {
                this.placeOrderDialog.showModal();
            } else if (evt.target.id === "btnCloseDialog") {
                this.placeOrderDialog.close();
            }
        });


        this.form.addEventListener("submit", e => {
            e.preventDefault();

            const formData = new FormData(this.form);

            const orderEvent = new CustomEvent("place-order", {
                composed: true, bubbles: true, detail: formData
            });
            this.dispatchEvent(orderEvent);
        });
    }

    //---------------------------------------
    async refresh(cartInput) {      

        const cart = cartInput;
        this.listContainer.innerHTML = "";
        let sum = 0;

        //Henter inn cart data fra orderen
        cart.cartArray.forEach((item, index) => {

            const divCart = document.createElement("div");
            divCart.innerHTML = `
                <h3>${item.chocoName}</h3>
                <p>ID: ${item.chocoID}</p>
                <p>Quantity: <input type="number" value="${item.quantity}" min="1" max="99" id="itemQuantity-${index}" disabled> ${item.price * item.quantity},-</p>
                <hr>
            `;
            sum += parseInt(item.price) * parseInt(item.quantity);
            this.listContainer.appendChild(divCart);
        });

        //Cart summary
        const divCartBottom = document.createElement("div");
        divCartBottom.innerHTML = `
            <p>Sum: ${sum + ",-"}</p>
            <button id="btnPlaceOrder">Place Order</button>
        `;
        this.listContainer.appendChild(divCartBottom);
    }

} //end of class


customElements.define("checkout-view", CheckoutView);