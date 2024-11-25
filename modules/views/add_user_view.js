
const html = `
    <link rel="stylesheet" href="styles/add_user_view_style.css">

<div id="add-user-wrapper">

    <h2>Create User</h2>
    <div id="listContainer">
        <form id="add-user-form" action="">
        
            <label for="username">Username (email):</label>
            <input required type="text" id="username" name="username"
            placeholder="Enter your email">
            
            <span id="username-error" style="color: red; display: none;">Please enter a valid email address</span>
            <br>
            
            <label for="password">Password</label>
            <input required type="password" id="password" name="password"
            placeholder="Enter your Password">
            <br>
            
            <label for="fullName">Full name:</label>
            <input required type="text" id="fullname" name="fullname"
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
                    Register
                </button>
            </div>
        </form>
    </div>
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
        this.errorSpan = this.shadowRoot.getElementById("username-error");
        //Regex for email
        this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        this.form.addEventListener("submit", evt => {
            evt.preventDefault();
            
            const formData = new FormData(this.form);


            const emailCheck = formData.get("username");

            if (!this.emailRegex.test(emailCheck)) {
                this.errorSpan.style.display = "block";
                return;
            }

            this.errorSpan.style.display = "none";

            const theEvent = new CustomEvent("add-user", { composed: true, bubbles: true, detail: formData });
            this.dispatchEvent(theEvent);
        });

        this.shadowRoot.getElementById("username").addEventListener("input", (e) => {
            if (this.emailRegex.test(e.target.value)) {
                this.errorSpan.style.display = "none";
            }
        });
    }
    

} //end of class


customElements.define("add-user-view", AddUserView);