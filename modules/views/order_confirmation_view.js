const html = `
<link rel="stylesheet" href="styles/order_confirmation_view_style.css">

<h2>Order Confirmed!</h2>
<div id="summary-container"> 
    <div id="viewContainer"></div>
    <div id="sumContainer"></div>
</div>
`;

export class OrderConfirmView extends HTMLElement {

    //--------------------------------------------
    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.viewContainer = this.shadowRoot.getElementById("viewContainer");
        this.sumContainer = this.shadowRoot.getElementById("sumContainer");

        this.totalItemPrice = 0;
    }

//------------------------------------------------------
async refresh(userData, cartItems, shipment) {
    this.viewContainer.innerHTML = "";

    const user = await userData;
    const shipmentInfo = await shipment;

    this.displayUserAndShipmentInfo(user, shipmentInfo);
    this.displayCartItems(cartItems);

    this.sumTotal();
}

//-------------------------------------------------------
displayUserAndShipmentInfo(user, shipmentInfo) {
    // Match ID'er for å få tak i riktig type og pris.
    for (let shipments of shipmentInfo) {
        if (user.shipping_id === shipments.id) {
            this.shipmentType = shipments.type;
            this.shipmentPrice = shipments.price;
            break; // Stopp loopen når det er funnet.
        }
    }

    const confirmationDiv = document.createElement("div");
    confirmationDiv.innerHTML = `
        <h2>Your order has been received!</h2>
        <h3>Your order number is: ${user.ordernumber}</h3>
        <p>Full name: ${user.customer_name}</p>
        <p>Email: ${user.email}</p>
        <p id="user-phone"></p>
        <p>Address: ${user.country}, ${user.city}, ${user.zipcode}, ${user.street}</p>
        <h4>Chosen shipping method: ${this.shipmentType}</h4>
        <hr>
        <h2>Your Order:</h2>
    `;

    if (user.phone != null) {
        let phone = confirmationDiv.querySelector("#user-phone");
        phone.innerHTML = `Phone number: ${user.phone}`;
    }

    this.viewContainer.appendChild(confirmationDiv);
}

//-------------------------------------------------------
displayCartItems(cartItems) {
    let sum = 0;
    
//Parse for å kunne bruke JSON objektet på nytt nedenfor.
    let parsedCart = JSON.parse(cartItems);
    console.log(parsedCart);

    parsedCart.forEach((item, index) => {
        const divCart = document.createElement("div");
        divCart.innerHTML = `
            <div id="cartInfoContainer">
                <h3>${item.chocoName}</h3>
                <p>ID: ${item.chocoID}</p>
                <p>Quantity: <input type="number" value="${item.quantity}" 
                min="1" max="99" id="itemQuantity-${index}" disabled> Total sum: ${item.price},-</p>
                <hr>
            </div>
        `;
        sum = item.price;
        this.viewContainer.appendChild(divCart);
    });

    this.totalItemPrice = sum;
}

//-------------------------------------------------------
sumTotal(){       
        this.sumContainer.innerHTML = "";
                //Handlekurv oppsummering
                const divCartBottom = document.createElement("div");

                const shipmentPrice = parseInt(this.shipmentPrice);
                const totalItemPrice = parseInt(this.totalItemPrice);
                const sumTotal = shipmentPrice + totalItemPrice;

                divCartBottom.innerHTML = `
                <hr>
                <p>Shipment: ${shipmentPrice},-</p>
                    <p>Sum total: ${sumTotal},-</p>
                `;
                this.sumContainer.appendChild(divCartBottom);
    }

}

customElements.define("order-confirm-view", OrderConfirmView);