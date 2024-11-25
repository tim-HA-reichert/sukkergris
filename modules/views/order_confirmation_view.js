const html = `
    <link rel="stylesheet" href=styles/order_confirmation_view_style.css>
    <h2>Order Confirmed!</h2>
    <div id="viewContainer"></div>
`;

export class OrderConfirmView extends HTMLElement {

    //--------------------------------------------
    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.viewContainer = this.shadowRoot.getElementById("viewContainer");
    }

    async refresh(userData, cartItems){

        this.viewContainer.innerHTML = "";
        let sum = 0;
        const user = await userData;

        const confirmationDiv = document.createElement("div");
            confirmationDiv.innerHTML = `
                <h2>Your order has been recieved!</h2>
                <h3>Your order number is: ${user.ordernumber}</3>
                <p>Full name: ${user.customer_name}</p>
                <p>Email: ${user.email}</p>
                <p id="user-phone"></p>
                <p>Address: ${user.country}, ${user.city}, ${user.zipcode}, ${user.street}</p>

                <h4>Chosen shipping method: ${user.shipping_id}</h4>
                    <hr>

                <h2>Your Order:</h2>
            `;
        if(user.phone != null){
            let phone = confirmationDiv.querySelector("#user-phone");
            phone.innerHTML = `
                Phone number: ${user.phone}
            `;
        }

        this.viewContainer.appendChild(confirmationDiv);

        cartItems.cartArray.forEach((item, index) => {

            const divCart = document.createElement("div");
            divCart.innerHTML = `
                <div id="cartInfoContainer">
                    <h3>${item.chocoName}</h3>
                    <p>ID: ${item.chocoID}</p>
                    <p>Quantity: <input type="number" value="${item.quantity}" min="1" max="99" id="itemQuantity-${index}" disabled> ${item.price * item.quantity},-</p>
                    <hr>
                </div>
            `;
            sum += parseInt(item.price) * parseInt(item.quantity);
            this.viewContainer.appendChild(divCart);
        });
    

    }

}

customElements.define("order-confirm-view", OrderConfirmView);