
const html = `    
    <h2>Add new product</h2>
    <hr>
    <div class="content-wrapper">
        <form id="addProductForm">
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
    <input type="text" id="deleteProduct" placeholder="Use ID to delete product">
    <button id="delete-product">Delete product</button>
<div> 

<hr>
    <h2>Find chocolate by category</h2>
    <div id="listContainer"></div>
`;


//===================================================
export class AddProductView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("addProductForm");
        this.listContainer = this.shadowRoot.getElementById("listContainer");
        
        this.form.addEventListener('submit', evt => {
            evt.preventDefault();           

            const formData = new FormData(this.form);            

            const theEvent = new CustomEvent("add-product", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(theEvent);
        });
    }
    
    async refresh(dataPromise) {        
        
        const data = await dataPromise; //wait for the promise to be resolved

        this.listContainer.innerHTML = "";

        for (let value of data) {

            const theDiv = document.createElement("div");
            theDiv.innerHTML = `
                <h3>${value.categoryID} ${value.categoryName}</h3>
                <hr>
            `;

            this.listContainer.appendChild(theDiv);

            theDiv.addEventListener('click', evt => {
                const theEvent = new CustomEvent("categoryselect", {composed: true, bubbles:true, detail: value});
                this.dispatchEvent(theEvent);
            });
            
        } 
    } //end of refresh

    async listChocolates(dataPromise){
 
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
                console.log(value);
            }
            
        }//End of listChocolates 
    
    async deleteProduct(productToDelete){
        
    } //End of deleteProduct 
    
} //end of class


//Burde vi legge til DELETE product knapp her? 



customElements.define("add-product-view", AddProductView);