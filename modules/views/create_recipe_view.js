const html = `
<h2>Create a new recipe!</h2>
<h4>We encourage crazy recipes.</h4>

<div id="recipeContainer"> 

    <form id="new-recipe-form" action="">
        <label for="recipe-title">Recipe Title</label>
        <input type="text" id="recipe-title" name="recipe-title"
            placeholder="Give your recipe a name!">

        <label for="recipe-text">Recipe Description</label>
        <input type="text" id="recipe-text" name="recipe-text"
            placeholder="Describe your recipe.">

        <button type="submit"> Submit your recipe!! </button>
    </form>
</div>
`;


export class CreateNewRecipeView extends HTMLElement {

    constructor(){
        
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("new-recipe-form");
    

 
        this.form.addEventListener("submit", evt => {
            evt.preventDefault();

            const formData = new FormData(this.form);

            const newRecipeEvent = new CustomEvent("submit-new-recipe", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(newRecipeEvent);
        });
    
    }

}

customElements.define("new-recipe-view", CreateNewRecipeView);