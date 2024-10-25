const html = `
<h2> Administration log in </h2>

    <div id="content-wrapper">
        <form id="login-form" action="">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username"
                placeholder="Enter your Username">

            <label for="password">Password</label>
            <input type="password" id="password" name="password"
                placeholder="Enter your Password">

            <div class="button-wrapper">
                <button type="submit">
                    Log in
                </button>
            </div>
        </form>
    </div>   
`;

const html2 = `

    <h2> Choose what to administrate </h2>

`;


export class LoginView extends HTMLElement {
    //---------------------------------------
    constructor(){
        
        super();
        
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("login-form");
        this.contentWrapper = this.shadowRoot.getElementById("content-wrapper");

        this.form.addEventListener("submit", evt => {
            evt.preventDefault();

            const formData = new FormData(this.form);

            const theEvent = new CustomEvent("log-in", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(theEvent);
        });
    }

    
  async refresh(aBool){

        if(aBool){
            this.contentWrapper.innerHTML = "";

            const theDiv = document.createElement("div");
            theDiv.innerHTML = `
            <button>Products</button>
            <button>Orders</button>
            <button>Users</button>
            <button>User comments/reviews</button>
            `;

            this.contentWrapper.appendChild(theDiv);

        } 

    }



}

customElements.define("login-view", LoginView);