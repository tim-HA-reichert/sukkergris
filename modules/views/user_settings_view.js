const html = `
    <button id="btnLogout">Logout</button>
    <h2>User Information</h2>
        <div id="userInformationContainer"></div>
    <hr>
    <h2>Change Information</h2>
    <div id="listContainer">
        <form id="change-user-information-form" action="">
        
            <label for="username">Username:</label>
            <input type="text" id="username" name="username"
            placeholder="Enter your Username">
            <span id="username-error" style="color: red; display: none;">Please enter a valid email address</span>

            
            <label for="password">Password</label>
            <input type="password" id="password" name="password"
            placeholder="Enter your Password">
            <br>
            
            <label for="fullName">Full name:</label>
            <input type="text" id="fullname" name="fullname"
                placeholder="Enter your full name">
            <br>
                
            <label for="street">Street:</label>
            <input type="text" id="street" name="street"
            placeholder="Enter your street address">
            <br>

            <label for="city">City:</label>
            <input type="text" id="city" name="city"
            placeholder="Enter your city">
            <br>

            <label for="zipcode">Zipcode:</label>
            <input type="number" id="zipcode" name="zipcode"
            placeholder="Enter your zipcode">
            <br>

            <label for="country">Country:</label>
            <input type="text" id="country" name="country"
            placeholder="Enter your country">
            <br>
            
            
            <label for="img_file">Profile picture:</label>
            <input type="file" id="img_file" name="img_file">
            
            <div class="button-wrapper">
                <button type="submit">
                    Change
                </button>
            </div>
        </form> 

        <hr>
    </div>
            <button id="btnDeleteUser">Delete User</button>

    <div id="list-comment-container"> </div>
            `;
            
export class UserSettingsView extends HTMLElement {
    //---------------------------------------
    constructor() {
        
        super();
        
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("change-user-information-form");
        this.userInformationContainer = this.shadowRoot.getElementById("userInformationContainer");
        this.listComments = this.shadowRoot.getElementById("list-comment-container");
        this.errorSpan = this.shadowRoot.getElementById("username-error");


        this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        this.form.addEventListener("submit", evt => {
            evt.preventDefault();
            
            const formData = new FormData(this.form);
            

            const emailCheck = formData.get("username");

        //Hvis testen er false, så viser vi en span med en beskjed.
        //Sjekker om emailCheck er tom
            if (emailCheck && !this.emailRegex.test(emailCheck)) {
                this.errorSpan.style.display = "block";
                return;
            }

            const theEvent = new CustomEvent("changed-user-information", { composed: true, bubbles: true, detail: formData });
            this.dispatchEvent(theEvent);
        });

        this.shadowRoot.getElementById("username").addEventListener("input", (e) => {
            //Hvis testen er true, ikke vis span. 
            //Sjekker om email er tom. 
            if (e.target.value && this.emailRegex.test(e.target.value)) {
                this.errorSpan.style.display = "none";
            }
        });

        this.activeButtons();
    }

//-------------------------------------------------------   

    activeButtons(){
        this.btnLogout = this.shadowRoot.getElementById("btnLogout");
        this.btnLogout.addEventListener("click", evt => {
            const theEvent = new CustomEvent("logout-user", { composed: true, bubbles: true });
            this.dispatchEvent(theEvent);
        });

        this.btnDeleteUser = this.shadowRoot.getElementById("btnDeleteUser");
        this.btnDeleteUser.addEventListener("click", evt => {
            const theEvent = new CustomEvent("delete-user", { composed: true, bubbles: true });
            this.dispatchEvent(theEvent);
        });
    }


//-------------------------------------------------------   
    refresh(userModel) {
        this.userInformationContainer.innerHTML = "";

        const theDiv = document.createElement("div");
            theDiv.innerHTML = `
                <p>Username: ${userModel.username}<p>
                <p>Full name: ${userModel.full_name}</p>
                <p>Country: ${userModel.country}</p>
                <p>Street: ${userModel.street}</p>
                <p>Zipcode: ${userModel.zipcode}</p>
            `;

        this.userInformationContainer.appendChild(theDiv);
        
    }

//-------------------------------------------------------
    async listUserComments(commentData){
        this.listComments.innerHTML="";
        
        let commentList = await commentData;
        
        for(let comment of commentList){
        const commentDiv = document.createElement("div");
            commentDiv.innerHTML = `
            <div class="user-comment-history">
                <h3>Your Reviews</h3>
                <p>${comment.comment_text}</p>

                <div id="btn-del">
                    <button class="btn-delete-comment">Delete Comment</button>
                </div>
                
                <hr>
            </div>
            `;

        const deleteButton = commentDiv.querySelector(".btn-delete-comment");
            deleteButton.addEventListener("click", e => {
                const deleteEvent = new CustomEvent("delete-comment", 
                    {composed: true, bubbles: true, detail:comment.id});
        
                this.dispatchEvent(deleteEvent);
            });            
        this.listComments.appendChild(commentDiv);
        }
    }
} //End of class

customElements.define("user-settings-view", UserSettingsView);