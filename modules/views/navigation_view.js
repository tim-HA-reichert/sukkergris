const html = `
        <form id="search-form" action="">
        <input type="text" placeholder="Search.." name="searchBar" id="searchBar">
            <button type="submit" id="searchBtn">Search</button>
        </form>

<div id="nav-wrapper">
<div id="navigationContainer"></div>
</div>
    <template id="logged-in">
        <button id="btnGoToCart">Go to shopping cart</button>
        
        <button id="user-forum-button">Read our user forum!</button>
        <button id="create-thread-btn">Create a new topic!</button>
        <img id="userPicture" src="" alt="users profile picture">
    </template>

    <template id="not-logged-in">
        <button id="btnGoToCart">Go to shopping cart</button>    
        
        <button id="btnLogin">Login</button>
        <button id="btnAddUser">Create User</button>
    </template>
`;


//NEEDTO: Add functionality to buttons. Basically: transfer functionality from main.js to here. 

//===================================================
export class NavigationView extends HTMLElement {    
    
    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.navigationContainer = this.shadowRoot.getElementById("navigationContainer"); 

        this.loggedIn = this.shadowRoot.getElementById("logged-in");
        this.notLoggedIn = this.shadowRoot.getElementById("not-logged-in");

        this.searchForm = this.shadowRoot.getElementById("search-form");

        this.searchForm.addEventListener("submit", (e) =>{
            e.preventDefault();

            const formData = new FormData(this.searchForm);
            const searchEvent = new CustomEvent("search-for-products", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(searchEvent);
        });
}

    isUserLogged(aUser) {
        this.navigationContainer.innerHTML = "";

        //Choose what to render
        //"aUser" is provided in main.js
        let template = aUser ? this.loggedIn : this.notLoggedIn;
            const clone = template.content.cloneNode(true);
            this.navigationContainer.appendChild(clone);
        
        //If not logged in, do this: 
        if(!aUser){
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
    }

    //seperate method for logged in users: 
    activeUser(pictureData){
        this.userPicture = this.shadowRoot.getElementById("userPicture");
        this.createThread = this.shadowRoot.getElementById("create-thread-btn");
        this.userForum = this.shadowRoot.getElementById("user-forum-button");
        this.btnGoToCart = this.shadowRoot.getElementById('btnGoToCart');
        
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
    }
} //end of class


customElements.define("navigation-view", NavigationView);