const html = `
<div class="content-wrapper">
    <input name="reviewToDelete" id="reviewToDelete" type="number" placeholder="Message ID" required>
    <button id="btnDeleteReview">Delete review</button>
</div> 
<hr>
<h2>All Reviews</h2>
<hr>
<div id="reviewContainer"></div>
`;

//===================================================
export class ReviewsView extends HTMLElement {



    //---------------------------------------
    constructor(){

        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.reviewContainer = this.shadowRoot.getElementById("reviewContainer");

        this.btnDeleteReview = this.shadowRoot.getElementById("btnDeleteReview");
        this.reviewToDelete = this.shadowRoot.getElementById("reviewToDelete");
    
        this.btnDeleteReview.addEventListener("click", e => {
            e.preventDefault();

            const deleteReviewEvent = new CustomEvent("deleteReview", 
                {composed: true, bubbles: true, detail: this.reviewToDelete.value});

            this.dispatchEvent(deleteReviewEvent);

            this.reviewToDelete.value = "";
        })
    }

//------------------------------------------------------
    async showReviews(reviewList){
        this.reviewContainer.innerHTML = "";
        const data = await reviewList;
        if(data) {
            for(let value of data){
    
                const userDiv = document.createElement("div");
                userDiv.innerHTML = `
            <div class="user-review-wrapper">
                <div class="review-info-wrapper">
                <h3>Message id: ${value.id}</h3>
                    <h4>Product id: ${value.product_id}</h4>
                    <h3>Username: ${value.username}</h3>
                    <h4>User id: ${value.user_id}</h4>
                    <p>Date: ${value.date}</p>
                    <p>Review Text: ${value.comment_text}</p>
                    <p>Rating: ${value.rating}</p>
               </div>
               <button class="user-review-delete-btn">Delete this review</button>
                    <hr>
            </div>
                `;

                const deleteButton = userDiv.querySelector(".user-review-delete-btn");
                deleteButton.addEventListener("click", () => {
                    const deleteReviewEvent = new CustomEvent("deleteReview", 
                        {composed: true, bubbles: true, detail: value.id});
        
                    this.dispatchEvent(deleteReviewEvent);
                });
                this.reviewContainer.appendChild(userDiv);
            }
        } else {
            const userDiv = document.createElement("div");
            userDiv.innerHTML = `
            <h3>No reviews added</h3>
            `;
            this.reviewContainer.appendChild(userDiv);
        }
    }
}

customElements.define("reviews-view", ReviewsView);