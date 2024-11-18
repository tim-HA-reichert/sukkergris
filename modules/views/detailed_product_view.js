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

        this.itemObject = await dataPromise; //wait for the promise to be resolved
        this.listContainer.innerHTML = "";
        const theDiv = document.createElement("div");

        theDiv.innerHTML = `
                <h1>${this.itemObject.chocoName}</h1>
                <h3>${this.itemObject.heading}</h3>
                <h3>${this.itemObject.categoryName}</h3>
                <img src="${this.itemObject.image}">
                <h1> HUSK discount </h1>
                <h3>${this.itemObject.description}</h3>
                <p>Price: ${this.itemObject.price},- kr</p>
                <button id="btnAddItem">Buy this item</button>
                <p>${this.itemObject.stock}</p>
                <p> ${this.itemObject.expected_shipped}</p>
                <p id="starSymbols"><p>

                
                <form id="review-form" style="display: none;">
                    <hr>
                    <h2>Leave a review!</h2>
                    <textarea type="text" id="review-text" name="review-text"
                        placeholder="Add a review!"></textarea>
                        
                    <br>

                    <label for="temp">Give a number of stars:</label>
                    <input type="number" id="inpStars" name="inpStars" min="1" max="5">

                    <br>

                    <div class="button-wrapper">
                        <button type="submit">
                            Post Review
                        </button>
                    </div>
                    <hr>
                </form>

                <button id="btnShowreviews">Show reviews</button>
                <button id="btnHidereviews" style="display: none;">Hide reviews</button>
                <div id="reviewContainer" style="display: none;"></div>
            `;



        this.listContainer.appendChild(theDiv);
        this.reviewContainer = this.shadowRoot.getElementById("reviewContainer");


        if (userModel) {
            this.form = this.shadowRoot.getElementById("review-form");
            this.form.style.display = "block";

            //Post review button
            this.form.addEventListener("submit", evt => {
                evt.preventDefault();

                //å lage et object med product ID, formdata, 
                const formData = new FormData(this.form);

                const data = {
                    chocoID: this.itemObject.chocoID,
                    formData: formData
                }

                //Event for å lage en review
                const theEvent = new CustomEvent("left-review", { composed: true, bubbles: true, detail: data });
                this.dispatchEvent(theEvent);
            });
        }

        //Add item to cart button
        const btnAddItem = this.shadowRoot.getElementById("btnAddItem");
        btnAddItem.addEventListener('click', evt => {
            const theEvent = new CustomEvent("addItem", { composed: true, bubbles: true, detail: this.itemObject });
            this.dispatchEvent(theEvent);
        });



        //Method for showing the amount of stars a product has
        if (this.itemObject.number_of_ratings > 0) {
            const ratingRounded = Math.round(Number(this.itemObject.rating))
            const starSymbols = this.shadowRoot.getElementById("starSymbols");
            starSymbols.innerHTML = stars[ratingRounded];
        };

        //Show review button
        const btnShowreviews = this.shadowRoot.getElementById("btnShowreviews");
        btnShowreviews.addEventListener('click', evt => {
            const theEvent = new CustomEvent("show-product-reviews", { composed: true, bubbles: true, detail: this.itemObject.chocoID });
            this.dispatchEvent(theEvent);
            this.reviewContainer.style.display = "block";
            btnShowreviews.style.display = "none";
            btnHidereviews.style.display = "block";
        });
        //Hide review button
        const btnHidereviews = this.shadowRoot.getElementById("btnHidereviews");
        btnHidereviews.addEventListener('click', evt => {
            ;
            this.reviewContainer.style.display = "none";
            btnShowreviews.style.display = "block";
            btnHidereviews.style.display = "none";
        });

    };

    async showReviews(areviewList) {

        if (areviewList) {
            this.reviewContainer.innerHTML = "";

            areviewList.forEach(element => {

                const reviewDiv = document.createElement("div");
                reviewDiv.innerHTML = `
                <hr>
                <h1>${element.username}</h1>
                <h4>${shortenDate(element.date)}</h4>
                <h3>${stars[element.rating]}</h3>
                <p>${element.comment_text}</p>
                <hr>
                `
                // console.log(element.rating);

                this.reviewContainer.appendChild(reviewDiv);
            });
        };

    };

    updateLive() {
        //Event for å vise kommentarer
        const theEvent = new CustomEvent("show-product-reviews", { composed: true, bubbles: true, detail: this.itemObject.chocoID });
        this.dispatchEvent(theEvent);
    }



} //end of class


customElements.define("detailed-product-view", DetailedProductView);