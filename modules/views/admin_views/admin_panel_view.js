const html = `
<h2>Admin Panel</h2>
<div id="buttonContainer"> 
    <button value="products"         id="admin-products">Add new product</button>
    <button value="orders"           id="admin-orders">Orders</button>
    <button value="users"            id="admin-users">Users</button>
    <button value="comments/reviews" id="admin-comments">User comments/reviews</button>
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
        this.adminComments = this.shadowRoot.getElementById("admin-comments");

    }

    async refresh(){
        let productValue = this.adminProducts.value;
        let orderValue = this.adminOrders.value;
        let userValue = this.adminUsers.value;
        let commentValue = this.adminComments.value;


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

        this.adminComments.addEventListener("click", function(evt){
            const btnClick = new CustomEvent("admin-comments", {composed: true, bubbles: true, detail: commentValue});
            this.dispatchEvent(btnClick);
        });
    }
}





customElements.define("admin-panel-view", AdminPanelView);