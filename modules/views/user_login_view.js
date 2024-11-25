const html = `
<link rel="stylesheet" href="styles/user_login_view_style.css">

<div id="login-wrapper">
    <h2> User login </h2>

        <div id="content-wrapper">
            <form id="login-form" action="">
                <label for="username">Username:</label>
                <input required type="text" id="username" name="username"
                    placeholder="Enter your Username">
                <br>
                <label for="password">Password</label>
                <input required type="password" id="password" name="password"
                    placeholder="Enter your Password">

                <div class="button-wrapper">
                    <button id="btn-login" type="submit">
                        Log in
                    </button>
                </div>
            </form>
        </div>   
</div>
`;


export class LoginView extends HTMLElement {
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("login-form");

        this.form.addEventListener("submit", evt => {
            evt.preventDefault();

            const formData = new FormData(this.form);

            const theEvent = new CustomEvent("log-in", { composed: true, bubbles: true, detail: formData });
            this.dispatchEvent(theEvent);
        });
    }
}

customElements.define("login-view", LoginView);