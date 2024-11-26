const html = `
<link rel="stylesheet" href="styles/style.css">

<div id="nav-wrapper">
<button id="btn-company-name">Sukkergris</button>

        <form id="search-form" action="">
        <input type="text" placeholder="Search.." name="searchBar" id="searchBar">
            <button type="submit" id="searchBtn">Search</button>
        </form>


    <div id="navigationContainer"></div>
    <template id="logged-in">
    <button id="btnGoToCart">Shopping Cart</button>
    
    <button id="user-forum-button">Read Forum!</button>
    <button id="create-thread-btn">New Topic</button>
    <button id="btnLogout">Logout</button>
    <img id="userPicture" src="" alt="users profile picture">
    </template>
    
    <template id="not-logged-in">
    <button id="btnGoToCart">Shopping Cart</button>    
    
    <button id="btnLogin">Login</button>
    <button id="btnAddUser">Create User</button>
    </template>
</div>
    `;

//===================================================
export class NavigationView extends HTMLElement {    
    
//------------------------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.navigationContainer = this.shadowRoot.getElementById("navigationContainer"); 

        this.loggedIn = this.shadowRoot.getElementById("logged-in");
        this.notLoggedIn = this.shadowRoot.getElementById("not-logged-in");

        this.searchForm = this.shadowRoot.getElementById("search-form");

        this.companyBtn = this.shadowRoot.getElementById("btn-company-name");

        this.companyBtn.addEventListener("click", e => {
            const homeEvent = new CustomEvent("back-to-home", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(homeEvent);
        })


        this.searchForm.addEventListener("submit", (e) =>{
            e.preventDefault();

            const formData = new FormData(this.searchForm);
            const searchEvent = new CustomEvent("search-for-products", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(searchEvent);
        });
}

//------------------------------------------------------
    isUserLogged(aUser) {
        this.navigationContainer.innerHTML = "";

        //Velg hva template skal inneholde
        let template = aUser ? this.loggedIn : this.notLoggedIn;
            const clone = template.content.cloneNode(true);
            this.navigationContainer.appendChild(clone);

            if(!aUser) {
                this.guestUser();
            }
    }

//------------------------------------------------------
    guestUser(){
        this.btnGoToCart = this.shadowRoot.getElementById('btnGoToCart');
        this.btnLogin = this.shadowRoot.getElementById("btnLogin");
        this.btnAddUser = this.shadowRoot.getElementById("btnAddUser");

        this.btnAddUser.addEventListener("click", (e) =>{
            const theEvent = new CustomEvent("add-new-user", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(theEvent);
        });

        this.btnLogin.addEventListener("click", (e) =>{
            const theEvent = new CustomEvent("log-in", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(theEvent);
        });

        this.btnGoToCart.addEventListener("click", (e) =>{
            const cartEvent = new CustomEvent("go-to-cart", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(cartEvent);
        });
    }


//------------------------------------------------------
    //Method for logged in users: 
    activeUser(pictureData){
        this.userPicture = this.shadowRoot.getElementById("userPicture");
        this.createThread = this.shadowRoot.getElementById("create-thread-btn");
        this.userForum = this.shadowRoot.getElementById("user-forum-button");
        this.btnGoToCart = this.shadowRoot.getElementById('btnGoToCart');
        this.btnLogout = this.shadowRoot.getElementById("btnLogout");
        
        this.userPicture.src = pictureData;
    
        this.createThread.addEventListener("click", (e) => {
                const createRecipeEvent = new CustomEvent("create-thread", {composed: true, bubbles:true, detail: e});
                this.dispatchEvent(createRecipeEvent);
        });

        this.userForum.addEventListener("click", (e)=>{
            const recipeEvent = new CustomEvent("go-to-threads", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(recipeEvent);
        });
   
        this.btnGoToCart.addEventListener("click", (e) =>{
            const cartEvent = new CustomEvent("go-to-cart", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(cartEvent);
        });
        this.userPicture.addEventListener("click", (e) =>{
            const settingsEvent = new CustomEvent("go-to-settings", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(settingsEvent);
        });

        this.btnLogout.addEventListener("click", evt => {
            const theEvent = new CustomEvent("logout-user", { composed: true, bubbles: true });
            this.dispatchEvent(theEvent);
        });

    }
} //end of class


customElements.define("navigation-view", NavigationView);