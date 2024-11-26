const html = `
<link rel="stylesheet" href="styles/checkout_view_style.css">
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
            <input type="text" id="phone" name="phone"
            placeholder="Enter your phone number">
            <br>
            

            <label for="shipping_id">Choose a shipment method:</label>
            <select id="shipping_id" name="shipping_id">
            </select>

            <input type="hidden" id="content" name="content">

            <div id="orderContentContainer"> </div>
        
            <div id="listContainer"></div>
            <div id="sumContainer"></div>
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
        this.sumContainer = this.shadowRoot.getElementById("sumContainer");
        this.shipment = this.shadowRoot.getElementById("shipping_id");

        this.shipmentPrice = 0;
        this.totalItemPrice = 0;


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
//Data av ting som blir sendt til server. "hidden" input. 
    async saveCart(cartInput){
        const cart = cartInput;
        const orderedItems = []
        //Legger masse ting i orderedItems.
        for(const items of cart.cartArray){
            orderedItems.push({
            chocoName: items.chocoName,
            chocoID: items.chocoID,
            categoryID: items.categoryID,
            quantity: items.quantity,
            price: items.price * items.quantity,
            });
        }

        //Henter ut HTML elementet
        const contentInput = this.shadowRoot.getElementById("content");
        //Konverter til JSON før det går til cfg "body". 
        contentInput.value = JSON.stringify(orderedItems);
    }

    //-------------------------------
    async addShipment(shipmentData) {
        this.shipment.innerHTML = "";
        const shipmentType = await shipmentData;
    
        const shipmentDiv = document.createElement("div");

        //Lager forskjellige alternativ basert på shippingdata fra server. Lagrer pris.
        for(let shipment of shipmentType){
            const option = document.createElement("option");
            
            option.value = shipment.id;
            option.price = shipment.price;

            //Hvis pris er = 0, skriv "Free".
            option.textContent = `${shipment.type}, (${shipment.price === "0" ? 
                "Free" : parseInt(shipment.price) + ",-"})`

            this.shipment.appendChild(option);
        }

        this.shipment.addEventListener("change", (e) =>{
            //For å få ut shippingprisen og brukes i "sumTotal". 
            this.shipmentPrice = parseInt(e.target.selectedOptions[0].price);
            this.sumTotal();
        });

    this.shipment.appendChild(shipmentDiv);
    }


    //---------------------------------------
    async totalPrice(cartInput) {      

        const cart = cartInput;
        this.listContainer.innerHTML = "";
        let sum = 0;

        let index = 0;

        //Henter inn cart data fra orderen
        for(let item of cart.cartArray){
            parseInt(item.price);
            parseInt(item.quantity);
            index++;

            const divCart = document.createElement("div");
            divCart.innerHTML = `
                <h3>${item.chocoName}</h3>
                <p>ID: ${item.chocoID}</p>
                <p>Quantity: <input type="number" value="${item.quantity}" 
                min="1" max="99" id="itemQuantity-${index}" disabled> Total sum: ${item.price * item.quantity},-</p>
                <hr>
            `;
            sum += item.price * item.quantity;
            this.listContainer.appendChild(divCart);
        };

        this.totalItemPrice = sum;
        this.sumTotal();
    }

    //----------------------------------------
    //Summerer for å gi en total. 
    sumTotal(){       
        this.sumContainer.innerHTML = "";
                //Cart summary
                const divCartBottom = document.createElement("div");

                const shipmentPrice = parseInt(this.shipmentPrice);
                const totalItemPrice = parseInt(this.totalItemPrice);
                let sumTotal = shipmentPrice + totalItemPrice;

                divCartBottom.innerHTML = `
                <p>Shipment: ${shipmentPrice},-</p>
                    <p>Sum total: ${sumTotal},-</p>
                    <input id="btnPlaceOrder" type="submit" value="Place Order">
                `;
                this.sumContainer.appendChild(divCartBottom);
                sumTotal = 0;
    }

    //---------------------------------------
    //Hvis bruker er logget inn, auto-fyll inputs.
    async loggedInUserInfo(userDataPromise){
        const userdata = await userDataPromise;
    
        this.shadowRoot.getElementById('email').value = userdata.username;
        this.shadowRoot.getElementById('street').value = userdata.street;
        this.shadowRoot.getElementById('city').value = userdata.city;
        this.shadowRoot.getElementById('zipcode').value = userdata.zipcode;
        this.shadowRoot.getElementById('country').value = userdata.country;  

    }

} //end of class


customElements.define("checkout-view", CheckoutView);