const html = `
    <link rel="stylesheet" href="styles/individual_forum_thread_view_style.css">


<div id="chosen-thread"> </div>
<div id="rating-wrapper">
    <div id="author-rating"> </div>    
    <div id="rate-the-author"> </div>
    <hr>
</div>

<div id="comment-container"></div>

<div id="new-comment-wrap">
    <h5>Care to comment?</h5>
    <form id="comment-form">
            <textarea type="text" id="comment-text" name="comment-text"
                placeholder="Add a comment!"></textarea>
            <button type="submit-comment"> Comment! </button>
    </form>
    <button id="delete-thread-btn">Delete thread</button>
</div>
`;

const stars = {
    1: "&#9733; &#9734; &#9734; &#9734; &#9734;",
    2: "&#9733; &#9733; &#9734; &#9734; &#9734;",
    3: "&#9733; &#9733; &#9733; &#9734; &#9734;",
    4: "&#9733; &#9733; &#9733; &#9733; &#9734;",
    5: "&#9733; &#9733; &#9733; &#9733; &#9733;",
}

//===================================================
export class IndividualThreadView extends HTMLElement{

    constructor(){

        super();
        this.attachShadow({mode:"open"});
        this.shadowRoot.innerHTML = html;

        this.chosenThread = this.shadowRoot.getElementById("chosen-thread");
        this.ratingDiv = this.shadowRoot.getElementById("author-rating");
        this.rateAuthor = this.shadowRoot.getElementById("rate-the-author");

        this.commentForm = this.shadowRoot.getElementById("comment-form");
        this.commentContainer = this.shadowRoot.getElementById("comment-container");

        this.deleteThreadBtn = this.shadowRoot.getElementById("delete-thread-btn");


        this.userToRate = null;


        this.commentForm.addEventListener("submit", e => {
            e.preventDefault();

            const formData = new FormData(this.commentForm);
            
            const commentEvent = new CustomEvent("submit-comment", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(commentEvent);
        });

        this.deleteThreadBtn.addEventListener("click", e => {
            e.preventDefault();

            const deleteEvent = new CustomEvent("delete-thread", {composed: true, bubbles: true, detail: e})
            this.dispatchEvent(deleteEvent);
        })
    }

//------------------------------------------------------
    async refresh(dataPromise){
        
        this.chosenThread.innerHTML = "";

        const chosenThread = await dataPromise; 

        const theDiv = document.createElement("div");

        theDiv.innerHTML = `
            <h1>${chosenThread.heading}</h1>
            <p>${chosenThread.message}</p>
            <h6>thread by: ${chosenThread.username}</h6>
        `;  
        this.chosenThread.appendChild(theDiv);
    }

//------------------------------------------------------
    async currentRating(authorData, authorToRate){
        this.ratingDiv.innerHTML = "";

        const authorList = await authorData;
        const selectAuthor = await authorToRate;
        let rating = null;

        //Går gjennom listen av alle brukere (authorID) og leter etter match med thread author ID.
        for (let author of authorList) {
            if (author.id === selectAuthor.user_id) {
                rating = author.beenz;
                
                this.userToRate = author.id;
                break; //Stopp loopen når det er funnet. 
                }
            }

            this.previousRatings(rating);
        }

//------------------------------------------------------
    previousRatings(aRating){
        const ratingInfoDiv = document.createElement("div");

        if (aRating > 0) {
            const ratingRounded = Math.round(Number(aRating));
            ratingInfoDiv.innerHTML = `
            <div id="current-rating-container">
                <h5>Current user rating:</h5>
                <p>${stars[ratingRounded]}</p>
            </div>

            <h6>Want to rate the author?</h6>
            `;
        } else {
            ratingInfoDiv.innerHTML = `
                <p>Be the first to rate this user!</p>
            `;
        }
        this.ratingDiv.appendChild(ratingInfoDiv);
    }

//------------------------------------------------------
    async rateTheAuthor() {
        //Lag error message for når noen prøver å rate seg selv.
        this.rateAuthor.innerHTML = "";

        //Star HTML element i form av en "div"
        const starContainer = document.createElement("div");
        starContainer.id = "star-container";
    
        // ChatGPT fra 143 -> 156
        // Generer stjerner med for-loop
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.innerHTML = "&#9734;";
            star.style.cursor = "pointer";
            star.style.fontSize = "24px";
            
            //Setter verdi på "star" med navn "rating-value". 
            //Matcher denne med "i"-verdi fra for-loopen.
            star.setAttribute("rating-value", i); 

            star.addEventListener("click", () => this.setRating(i));

            starContainer.appendChild(star);
        }
    
        this.rateAuthor.appendChild(starContainer);
    }
    
//------------------------------------------------------
    setRating(rating) {
        const stars = this.shadowRoot.querySelectorAll("#star-container span");
        
        //ChatGPT fra 166 -> 180
        let index = 0;
        for (const star of stars) {
            // Om index er mindre enn rating, print stjerne
            if (index < rating) {
                star.innerHTML = "&#9733;";
            } else {
                star.innerHTML = "&#9734;";
            }
            index++;
        }
        const ratingEvent = new CustomEvent("rate-author", {
            composed: true, bubbles: true, detail: 
                { meowRating: rating, user: this.userToRate },

        });
            this.dispatchEvent(ratingEvent);
        }

//------------------------------------------------------
    async comment(commentData){
        this.commentContainer.innerHTML = "";

        const comments = await commentData;

        for(let value of comments){
            const commentDiv = document.createElement("div");
            commentDiv.innerHTML = `
                <p>${value.message}</p>
                <h6>Posted by user: ${value.username}</h6>
                <hr>
                `;

            this.commentContainer.appendChild(commentDiv);
        }
    }
}

customElements.define("individual-thread-view", IndividualThreadView);