
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
            <hr>

            <input type="submit" value="Add new product">
        </form>
    <div>

 <hr>
<div class="content-wrapper">
    <input type="text" id="deleteProduct">
    <label for="deleteProduct">Use product ID to delete product</label>
<div> 
`;


//===================================================
export class AddProductView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("addProductForm");

        
        this.form.addEventListener('submit', evt => {
            evt.preventDefault();           

            const formData = new FormData(this.form);            

            const theEvent = new CustomEvent("add-product", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(theEvent);
        });
    }    
} //end of class

//Burde vi legge til DELETE product knapp her? 



customElements.define("add-product-view", AddProductView);