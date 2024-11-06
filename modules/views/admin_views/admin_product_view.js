
const html = `    
    <h2>Add new product</h2>
    <hr>
    <div class="content-wrapper">
        <form id="add-product-form">
            <input name="name"     placeholder="Product name"><br>
            <input name="heading"  placeholder="Heading"><br>
            <input name="category_id" placeholder="Category ID (1-7)"><br>
            <input name="description" placeholder="Description"><br>
            <input name="price"    placeholder="Price"><br>
            <input name="discount" placeholder="Discount"><br>
            <input name="carbohydrates" placeholder="Nutrients"><br>
            <input name="stock"         placeholder="Stock amount"><br>
            <input name="expected_shipment" placeholder="Expected Shipment"><br>
            <input name="reserved_members"  placeholder="Only for members?"><br>
            <input name="thumb" type="file"><br>

            <input type="submit" value="Add new product">
        </form>
    <div>

 <hr>
<div class="content-wrapper">
    <input name="delete-product" id="delete-product" type="number" placeholder="Use ID to delete product" required>
    <button id="deleteButton">Delete product with ID</button>
<div> 

<hr>
    <h2>Deletable chocolates</h2>
    <div id="listContainer"></div>
`;


//===================================================
export class adminProductsView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("add-product-form");
        this.listContainer = this.shadowRoot.getElementById("listContainer");
        this.deleteProductID = this.shadowRoot.getElementById("delete-product");
        this.deleteButton = this.shadowRoot.getElementById("deleteButton");


        //Add a product
        this.form.addEventListener('submit', evt => {
            evt.preventDefault();           
            const formData = new FormData(this.form);            

            const theEvent = new CustomEvent("add-product", 
                {composed: true, bubbles:true, detail: formData});

            this.dispatchEvent(theEvent);
        });


        //Delete a product
        this.deleteButton.addEventListener("click", evt => {
            evt.preventDefault();  

            const deleteEvent = new CustomEvent("delete-product", 
                {composed: true, bubbles: true, detail: this.deleteProductID.value});

            this.dispatchEvent(deleteEvent);

            this.deleteProductID.value = "";
        });
    }

    async chocoDeletionList (dataPromise){
            this.listContainer.innerHTML = "";
    
            const data = await dataPromise; //wait for the promise to be resolved
    
            for (let value of data) {
    
                const theDiv = document.createElement("div");
                theDiv.innerHTML = `
                    <h3>${value.chocoName}</h3>
                    <p>Price: ${value.price},-</p>
                    <p>ID: ${value.chocoID}</p>
                    <hr>
                `;
                this.listContainer.appendChild(theDiv);
            }
        }//End of deleteChoco 

} //end of class


customElements.define("add-product-view", adminProductsView);