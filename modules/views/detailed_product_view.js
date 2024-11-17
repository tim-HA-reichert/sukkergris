import { shortenDate } from "../utilities.js";

const html = `
    <h2>Product Details</h2>
    <div id="listContainer"></div>
`;


const stars = {
    1: "&#9733; &#9734; &#9734; &#9734; &#9734;",
    2: "&#9733; &#9733; &#9734; &#9734; &#9734;",
    3: "&#9733; &#9733; &#9733; &#9734; &#9734;",
    4: "&#9733; &#9733; &#9733; &#9733; &#9734;",
    5: "&#9733; &#9733; &#9733; &#9733; &#9733;",
}

//===================================================
export class DetailedProductView extends HTMLElement {

    //---------------------------------------
    constructor() {

        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = html;
        this.listContainer = this.shadowRoot.getElementById("listContainer");
    }

    //---------------------------------------
    async refresh(dataPromise, userModel) { // DataPromise er et class object med item.

        const itemObject = await dataPromise; //wait for the promise to be resolved
        this.listContainer.innerHTML = "";
        const theDiv = document.createElement("div");

        theDiv.innerHTML = `
                <h1>${itemObject.chocoName}</h1>
                <h3>${itemObject.heading}</h3>
                <h3>${itemObject.categoryName}</h3>
                <img src="${itemObject.image}">
                <h1> HUSK discount </h1>
                <h3>${itemObject.description}</h3>
                <p>Price: ${itemObject.price},- kr</p>
                <button id="btnAddItem">Buy this item</button>
                <p>${itemObject.stock}</p>
                <p> ${itemObject.expected_shipped}</p>
                <p id="starSymbols"><p>

                
                <form id="comment-form" style="display: none;">
                    <hr>
                    <h2>Leave a review!</h2>
                    <textarea type="text" id="comment-text" name="comment-text"
                        placeholder="Add a comment!"></textarea>
                        
                    <br>

                    <label for="temp">Give a number of stars:</label>
                    <input type="number" id="inpStars" min="1" max="5"/>

                    <br>

                    <div class="button-wrapper">
                        <button type="submit">
                            Post Comment
                        </button>
                    </div>
                    <hr>
                </form>

                <button id="btnShowComments">Show Comments</button>
                <button id="btnHideComments" style="display: none;">Hide Comments</button>
                <div id="commentContainer" style="display: none;"></div>
            `;



        this.listContainer.appendChild(theDiv);
        this.commentContainer = this.shadowRoot.getElementById("commentContainer");


        if (userModel) {
            this.form = this.shadowRoot.getElementById("comment-form");
            this.form.style.display = "block";

            this.form.addEventListener("submit", evt => {
                evt.preventDefault();

                //å lage et object med product ID, formdata, 
                const formData = new FormData(this.form);

                const data = {
                    chocoID: itemObject.chocoID,
                    formData: formData
                }


                const theEvent = new CustomEvent("left-comment", { composed: true, bubbles: true, detail: data });
                this.dispatchEvent(theEvent);
            });
        }

        //Add item to cart button
        const btnAddItem = this.shadowRoot.getElementById("btnAddItem");
        btnAddItem.addEventListener('click', evt => {
            const theEvent = new CustomEvent("addItem", { composed: true, bubbles: true, detail: itemObject });
            this.dispatchEvent(theEvent);
        });



        //Method for showing the amount of stars a product has
        if (itemObject.number_of_ratings > 0) {
            const ratingRounded = Math.round(Number(itemObject.rating))
            const starSymbols = this.shadowRoot.getElementById("starSymbols");
            starSymbols.innerHTML = stars[ratingRounded];
        };

        //Show comment button
        const btnShowComments = this.shadowRoot.getElementById("btnShowComments");
        btnShowComments.addEventListener('click', evt => {
            const theEvent = new CustomEvent("show-product-comments", { composed: true, bubbles: true, detail: itemObject.chocoID});
            this.dispatchEvent(theEvent);
            this.commentContainer.style.display = "block";
            btnShowComments.style.display = "none";
            btnHideComments.style.display = "block";
        });
        //Hide comment button
        const btnHideComments = this.shadowRoot.getElementById("btnHideComments");
        btnHideComments.addEventListener('click', evt => {;
            this.commentContainer.style.display = "none";
            btnShowComments.style.display = "block";
            btnHideComments.style.display = "none";
        });

    };

    async showComments (aCommentList) {
        if(aCommentList) {
            this.commentContainer.innerHTML = null
            aCommentList.forEach(element => {
    
                const commentDiv = document.createElement("div");
                commentDiv.innerHTML = `
                <hr>
                <h1>UserID: ${element.user_id}</h1>
                <h4>Date: ${shortenDate(element.date)}</h4>
                <h3>${stars[element.rating]}</h3>
                <p>${element.comment_text}</p>
                <hr>
                `
                this.commentContainer.appendChild(commentDiv);
            });
        }
        
    }



} //end of class


customElements.define("detailed-product-view", DetailedProductView);