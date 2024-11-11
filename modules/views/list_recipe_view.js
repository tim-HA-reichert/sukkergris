const html = `
<h2>Recipes created by our users</h2>
<div id="recipeContainer"> </div>
`;


//===================================================
export class RecipeListView extends HTMLElement {

    //---------------------------------------
    constructor(){

        super();
        
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.recipeContainer = this.shadowRoot.getElementById("recipeContainer");
    }

    //---------------------------------------
    async loadRecipes(recipePromise){
        this.recipeContainer.innerHTML = "";

        const recipes = await recipePromise;
        
        for(let value of recipes){

            const theDiv = document.createElement("div");
            theDiv.innerHTML = `
                <h3>${value.heading}</h3>
                <p>${value.message}</p>
                <hr>
            `;

            this.recipeContainer.appendChild(theDiv);

            theDiv.addEventListener('click', evt => {
                const wishToCommentEvent = new CustomEvent("wish-to-comment", {composed: true, bubbles:true, detail: value});
                this.dispatchEvent(wishToCommentEvent);
            });


        }

    }
}

customElements.define("recipe-list-view", RecipeListView);






