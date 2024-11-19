const html = `
    <h2>All orders</h2>

    <div class="content-wrapper">
    <input name="delete-order" id="delete-order" type="number" placeholder="use ID to delete order" required>
    <button id="delete-order-button">Delete order with ID</button>
<div> 
<hr>
    <div id="orderContainer"></div>
`;


//===================================================
export class OrderListView extends HTMLElement {



    //---------------------------------------
    constructor(){

        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.orderContainer = this.shadowRoot.getElementById("orderContainer");

        this.deleteOrderBtn = this.shadowRoot.getElementById("delete-order-button");
        this.orderToDelete = this.shadowRoot.getElementById("delete-order");
    
        this.deleteOrderBtn.addEventListener("click", e => {
            e.preventDefault();

            
            const deleteEvent = new CustomEvent("delete-order", 
                {composed: true, bubbles: true, detail: this.orderToDelete.value});

            this.dispatchEvent(deleteEvent);

            this.orderToDelete.value = "";
        })
    
    }


    async getOrders(dataPromise){
        this.orderContainer.innerHTML = "";

        const data = await dataPromise;

        for(let value of data){

            const orderDiv = document.createElement("div");
            orderDiv.innerHTML = `
                <h2>Made by customer: ${value.customer_name}</h2> 
                <h3>Order number: ${value.ordernumber}</h3>
                <h4>Order ID: ${value.id}</h4>
                <h4>Shipping ID: ${value.shipping_id}</h4>
                <hr>
            `;
            this.orderContainer.appendChild(orderDiv);
        }
    }
}

customElements.define("order-list-view", OrderListView);