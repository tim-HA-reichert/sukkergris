const html = `
<h2>Admin Panel</h2>
<div id="buttonContainer"> 
    <button value="products"         id="admin-products">Add/Delete/Change Products</button>
    <button value="orders"           id="admin-orders">Orders</button>
    <button value="users"            id="admin-users">Users</button>
    <button value="reviews"          id="admin-reviews">User reviews</button>
</div>  
`;


export class AdminPanelView extends HTMLElement {
    //---------------------------------------
    constructor(){
        
        super();
        
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.adminProducts = this.shadowRoot.getElementById("admin-products");
        this.adminOrders = this.shadowRoot.getElementById("admin-orders");
        this.adminUsers = this.shadowRoot.getElementById("admin-users");
        this.adminReviews = this.shadowRoot.getElementById("admin-reviews");

    }

//---------------------------------------------------------
//Funksjon for å gi knapper funksjonalitet
    async refresh(){
        let productValue = this.adminProducts.value;
        let orderValue = this.adminOrders.value;
        let userValue = this.adminUsers.value;
        let reviewValue = this.adminReviews.value;


        this.adminProducts.addEventListener("click", function(evt){
            const btnClick = new CustomEvent("admin-products", {composed: true, bubbles: true, detail: productValue});
            this.dispatchEvent(btnClick);
        });

        this.adminOrders.addEventListener("click", function(evt){
            const btnClick = new CustomEvent("admin-orders", {composed: true, bubbles: true, detail: orderValue});
            this.dispatchEvent(btnClick);
        });

        this.adminUsers.addEventListener("click", function(evt){
            const btnClick = new CustomEvent("admin-users", {composed: true, bubbles: true, detail: userValue});
            this.dispatchEvent(btnClick);
        });

        this.adminReviews.addEventListener("click", function(evt){
            const btnClick = new CustomEvent("admin-reviews", {composed: true, bubbles: true, detail: reviewValue});
            this.dispatchEvent(btnClick);
        });
    }
}//End of class





customElements.define("admin-panel-view", AdminPanelView);