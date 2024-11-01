
const html = `
    <h2>Create User</h2>
    <div id="listContainer">
        <form id="add-user-form" action="">
        
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
        this.form = this.shadowRoot.getElementById("add-user-form");

        this.form.addEventListener("submit", evt => {
            evt.preventDefault();
            
            const formData = new FormData(this.form);

            // //Legger inn test verdier for alle variabler
            // formData.forEach((value, key) => {
            //     formData.set(key, "Test2");
            // });
            
            const theEvent = new CustomEvent("add-user", { composed: true, bubbles: true, detail: formData });
            this.dispatchEvent(theEvent);
        });


        
    }

} //end of class


customElements.define("add-user-view", AddUserView);