const html = `
<link rel="stylesheet" href="styles/order_confirmation_view_style.css">

<h2>Order Confirmed!</h2>
<div id="viewContainer"></div>
<div id="sumContainer"></div>
`;

export class OrderConfirmView extends HTMLElement {

    //--------------------------------------------
    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.viewContainer = this.shadowRoot.getElementById("viewContainer");
        this.sumContainer = this.shadowRoot.getElementById("sumContainer");

        //this.shipmentPrice = 0;
        this.totalItemPrice = 0;
    }

    async refresh(userData, cartItems, shipment){
        this.viewContainer.innerHTML = "";

        const user = await userData;
        const shipmentInfo = await shipment;

        let sum = 0;

        //Match ID'er for å få tak i riktig type og pris. 
        for (let shipments of shipmentInfo) {
            if (user.shipping_id === shipments.id) {

                this.shipmentType = shipments.type;
                this.shipmentPrice = shipments.price;
                
                break; //Stopp loopen når det er funnet. 
            }
        }



        const confirmationDiv = document.createElement("div");
            confirmationDiv.innerHTML = `
                <h2>Your order has been recieved!</h2>
                <h3>Your order number is: ${user.ordernumber}</3>
                <p>Full name: ${user.customer_name}</p>
                <p>Email: ${user.email}</p>
                <p id="user-phone"></p>
                <p>Address: ${user.country}, ${user.city}, ${user.zipcode}, ${user.street}</p>

                <h4>Chosen shipping method: ${this.shipmentType}</h4>
                    <hr>

              <!---  <h2>Your Order:</h2> -->
            `;
//Vi kan gjøre dette for å få tak i sjokoladen igjen: 
            console.log(JSON.parse(user.content));
//Men spørs om det er vits. 


        if(user.phone != null){
            let phone = confirmationDiv.querySelector("#user-phone");
            phone.innerHTML = `
                Phone number: ${user.phone}
            `;
        }
this.viewContainer.appendChild(confirmationDiv);



//Utfordring, eller drite i? Hvordan vise bestilte produkter i order confirm view? Vi tømmer carten før dette. 
        cartItems.cartArray.forEach((item, index) => {

            const divCart = document.createElement("div");
            divCart.innerHTML = `
            <div id="cartInfoContainer">
                <h3>${item.chocoName}</h3>
                <p>ID: ${item.chocoID}</p>
                <p>Quantity: <input type="number" value="${item.quantity}" 
                min="1" max="99" id="itemQuantity-${index}" disabled> Total sum: ${item.price * item.quantity},-</p>
                <hr>
            </div>
            `;
            sum += parseInt(item.price) * parseInt(item.quantity);
            //this.totalItemPrice = sum;
            this.viewContainer.appendChild(divCart);
        });
    
       // this.sumTotal();

    }
/* 
    sumTotal(){       
        this.sumContainer.innerHTML = "";
                //Cart summary
                const divCartBottom = document.createElement("div");

                const shipmentPrice = parseInt(this.shipmentPrice);
                const totalItemPrice = parseInt(this.totalItemPrice);
                const sumTotal = shipmentPrice + totalItemPrice;

                divCartBottom.innerHTML = `
                <p>Shipment: ${shipmentPrice},-</p>
                    <p>Sum total: ${sumTotal},-</p>
                    <input type="submit" value="Place Order">
                `;
                this.sumContainer.appendChild(divCartBottom);
    }


 */

}

customElements.define("order-confirm-view", OrderConfirmView);