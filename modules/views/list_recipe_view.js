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
        this.recipeConatiner.this.shadowRoot.getElementById("recipeContainer");
    }

    async loadRecipes(recipePromise){
        
        const recipes = await recipePromise;
        
        this.recipeContainer.innerHTML = "";

        for(let value of recipes){
            const theDiv = document.createElement("div");
            theDiv.innerHTML = `
                <h3>${value.heading}</h3>
            `;
        }

    }
}

customElements.define("recipe-list-view", RecipeListView);






