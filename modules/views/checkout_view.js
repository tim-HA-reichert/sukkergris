
const html = `
    <h2>Checkout</h2>

        <form id="checkout-form" action="">
            <label for="name">Your full name:</label>
            <input required type="text" id="customer_name" name="customer_name"
            placeholder="Enter your full name">
            <br>

            <label for="email">Email:</label>
            <input required type="text" id="email" name="email"
            placeholder="Enter your email address">
            <br>

            <label for="street">Street address:</label>
            <input required type="text" id="street" name="street"
            placeholder="Enter your street address">
            <br>

            <label for="city">City:</label>
            <input required type="text" id="city" name="city"
            placeholder="Enter your city">
            <br>

            <label for="zipcode">ZIP code:</label>
            <input required type="text" id="zipcode" name="zipcode"
            placeholder="Enter your ZIP code">
            <br>

            <label for="country">Country:</label>
            <input required type="text" id="country" name="country"
            placeholder="Enter your country">
            <br>

            <label for="phone">Phone: </label>
            <input required type="text" id="phone" name="phone"
            placeholder="Enter your phone number">
            <br>


            <input type="hidden" id="content" name="content">

            <div id="orderContentContainer"> </div>
        
            <div id="listContainer"></div>
        </form>
`;


//===================================================
export class CheckoutView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        
        this.form = this.shadowRoot.getElementById("checkout-form");
        this.listContainer = this.shadowRoot.getElementById("listContainer");

        
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

        //Array to hold items
        const orderedItems = [];

        //Populate the orderedItems array
        for(const items of cart.cartArray){
            orderedItems.push({
            chocoID: items.chocoID,
            categoryID: items.categoryID,
            quantity: items.quantity,
            price: items.price * items.quantity,
            }
        )
    }

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

        //Update hidden input for content with orderedItems array
        const contentInput = this.shadowRoot.getElementById("content");
        //Convert to JSON before entering into cfg.body
        contentInput.value = JSON.stringify(orderedItems);

        //Cart summary
        const divCartBottom = document.createElement("div");
        divCartBottom.innerHTML = `
            <p>Sum: ${sum + ",-"}</p>
            <input type="submit" value="Place Order">
        `;
        this.listContainer.appendChild(divCartBottom);
    }

} //end of class


customElements.define("checkout-view", CheckoutView);