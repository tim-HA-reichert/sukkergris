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

export class AdminLoginView extends HTMLElement {
    //---------------------------------------
    constructor(){
        
        super();
        
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("login-form");

        this.form.addEventListener("submit", evt => {
            evt.preventDefault();

            const formData = new FormData(this.form);

            //Event for å sende ut skjema/form til server
            const theEvent = new CustomEvent("log-in", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(theEvent);
        });
    }
}//End of class

customElements.define("login-view", AdminLoginView);