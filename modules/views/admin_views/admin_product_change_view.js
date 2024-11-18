const html = `
    <h2>Change a product</h2>
    <div class="content-wrapper">
        <form id="change-product-form">
            <input name="id"       placeholder ="ID of product to change" required><br>
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

            <input type="submit" value="change the product">
        </form>
    <div>
    <hr>

    <h2>Changeable chocolates</h2>
    <div id="listContainer"></div>
`;

//Add show info on click functionality? 
export class changeProductView extends HTMLElement{

    //----------------------------------------
    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("change-product-form");
        this.listContainer = this.shadowRoot.getElementById("listContainer");
    

    this.form.addEventListener('submit', evt => {
        evt.preventDefault();
        
        const formData = new FormData(this.form);

        const changeEvent = new CustomEvent("change-product", {
            composed: true, bubbles: true, detail: formData });

        this.dispatchEvent(changeEvent);
        });
    }  


    async changeableChoco (dataPromise){
        const data = await dataPromise; 
        this.listContainer.innerHTML = "";

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
    }
}




customElements.define("change-product-view", changeProductView);