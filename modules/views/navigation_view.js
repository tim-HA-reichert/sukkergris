const html = `
        <form id="search-form" action="">
        <input type="text" placeholder="Search.." name="searchBar" id="searchBar">
            <button type="submit" id="searchBtn">Search</button>
        </form>
        <button id="btnGoToCart">Go to shopping cart</button>
    

<div id="navigationContainer"></div>

    <template id="logged-in">
        <img id="userPicture" src="" alt="users profile picture">
        <button id="user-made-recipes">Read our user-made recipes!</button>
        <button id="create-recipe-btn">Create a new recipe!</button>
    </template>

    <template id="not-logged-in">
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
        this.btnGoToCart = this.shadowRoot.getElementById('btnGoToCart');
       

        this.searchForm.addEventListener("submit", (e) =>{
            e.preventDefault();

            const formData = new FormData(this.searchForm);
            const searchEvent = new CustomEvent("search-for-products", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(searchEvent);
        });



        this.btnGoToCart.addEventListener("click", (e) =>{
            const cartEvent = new CustomEvent("go-to-cart", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(cartEvent);
        });
}

    isUserLogged(aUser) {
        this.navigationContainer.innerHTML = "";

        //Choose what to render
        //"aUser" is provided in main.js
        let template =  aUser ? this.loggedIn : this.notLoggedIn;
            const clone = template.content.cloneNode(true);
            this.navigationContainer.appendChild(clone);
        
        //If not logged in, do this: 
        if(!aUser){
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
        } 
    }

    //seperate method for logged in users: 
    activeUser(pictureData){
        this.userPicture = this.shadowRoot.getElementById("userPicture");
        this.createRecipe = this.shadowRoot.getElementById("create-recipe-btn");
        this.userRecipes = this.shadowRoot.getElementById("user-made-recipes");
        
        this.userPicture.src = pictureData;
    
        this.createRecipe.addEventListener("click", (e) => {
                const createRecipeEvent = new CustomEvent("create-recipe", {composed: true, bubbles:true, detail: e});
                this.dispatchEvent(createRecipeEvent);
        });

        this.userRecipes.addEventListener("click", (e)=>{
            const recipeEvent = new CustomEvent("go-to-recipes", {composed: true, bubbles:true, detail: e});
            this.dispatchEvent(recipeEvent);
        });
    }
} //end of class


customElements.define("navigation-view", NavigationView);