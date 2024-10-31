
const html = `
    <h2>Create User</h2>
    <div id="listContainer">
        <form id="login-form" action="">
        
            <label for="username">Username:</label>
            <input required type="text" id="username" name="username"
            placeholder="Enter your Username">
            <br>
            
            <label for="password">Password</label>
            <input required type="password" id="password" name="password"
            placeholder="Enter your Password">
            <br>
            
            <label for="fullName">Full name:</label>
            <input required type="text" id="fullName" name="fullName"
                placeholder="Enter your full name">
            <br>
                
            <label for="street">Street:</label>
            <input required type="text" id="street" name="street"
            placeholder="Enter your street address">
            <br>

            <label for="city">City:</label>
            <input required type="text" id="city" name="city"
            placeholder="Enter your city">
            <br>

            <label for="zipcode">Zipcode:</label>
            <input required type="number" id="zipcode" name="zipcode"
            placeholder="Enter your zipcode">
            <br>

            <label for="country">Country:</label>
            <input required type="text" id="country" name="country"
            placeholder="Enter your country">
            <br>
            
            
            <label for="img_file">Profile picture:</label>
            <input type="file" id="img_file" name="img_file">

            <hr>

            <div class="button-wrapper">
                <button type="submit">
                    Create User
                </button>
            </div>
        </form>
    </div>
`;


//===================================================
export class AddUserView extends HTMLElement {

    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = html;
        this.listContainer = this.shadowRoot.getElementById("listContainer");
    }

    //---------------------------------------
    async refresh(dataPromise) { // DataPromise er et class object med item.

        const itemObject = await dataPromise; //wait for the promise to be resolved
        this.listContainer.innerHTML = "";
        const theDiv = document.createElement("div");

        theDiv.innerHTML = `
                <h1>Dette er en test I guess</h1>
                <h1>${itemObject.chocoName}</h1>
                <button id="btnAddItem">Buy this item</button>                
            `;

        this.listContainer.appendChild(theDiv);

        // const btnAddItem = this.shadowRoot.getElementById("btnAddItem");

        // btnAddItem.addEventListener('click', evt => {
        //     const theEvent = new CustomEvent("addItem", { composed: true, bubbles: true, detail: itemObject });
        //     this.dispatchEvent(theEvent);
        // })
    }

} //end of class


customElements.define("add-user-view", AddUserView);