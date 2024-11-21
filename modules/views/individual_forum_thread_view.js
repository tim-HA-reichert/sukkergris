const html = `
<div id="chosen-thread"> </div>
<div id="author-rating"> </div>

<div id="rate-the-author"> </div>

<hr>
<div id="comment-container"> </div>

<h5>Care to comment?</h5>

<form id="comment-form">
        <textarea type="text" id="comment-text" name="comment-text"
            placeholder="Add a comment!"> </textarea>
        <button type="submit-comment"> Comment! </button>
</form>

<button id="delete-thread-btn">Delete thread</button>
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

    async currentRating(authorData, authorToRate){
        this.ratingDiv.innerHTML = "";

        const authorID = await authorData;
        const selectAuthor = await authorToRate;

        console.log(authorID);
        console.log(selectAuthor);

        let rating = null;

        const ratingInfoDiv = document.createElement("div");

        //Går gjennom listen av alle brukere (authorID) og leter etter match med thread author ID.
        for (let author of authorID) {
            if (author.id === selectAuthor.user_id) {
                rating = author.beenz;
                
                this.userToRate = author.id;
                break; //Stopp loopen når det er funnet. 
            }
        }

        if (rating > 0) {
            const ratingRounded = Math.round(Number(rating))
            ratingInfoDiv.innerHTML = `
             <h5>Current rating:</h5>
            <p>${stars[ratingRounded]}</p>
            <h6>Want to rate the author?</h6>
            `;
        }else{
            ratingInfoDiv.innerHTML = `
                <p>Be the first to rate this user!</p>
            `;
        }
        this.ratingDiv.appendChild(ratingInfoDiv);
    }

    async rateTheAuthor() {
        //Set in error message for when rating on self. 
        this.rateAuthor.innerHTML = "";
    
        //Star HTML element i form av en "div"
        const starContainer = document.createElement("div");
        starContainer.id = "star-container";
    
        // ChatGPT fra 130 -> 147
        // Generate stars dynamically
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.innerHTML = "&#9733;";
            star.style.cursor = "pointer";
            star.style.fontSize = "24px";
            star.setAttribute("rating-value", i); //Setter en ny verdi på "star" med navn rating-value. Matcher denne med "i" fra for-loopen.
    
            // Add click event listener
            star.addEventListener("click", () => {
                const ratingValue = star.getAttribute("rating-value"); //Henter stjernens verdi. 
    
                const ratingEvent = new CustomEvent("rate-author", {
                    composed: true, bubbles: true, detail: 
                    { meowRating: Number(ratingValue), user: this.userToRate },
                });
                this.dispatchEvent(ratingEvent);
            });
    
            // Add the star to the container
            starContainer.appendChild(star);
        }
    
        // Add the star container to the rateAuthor div
        this.rateAuthor.appendChild(starContainer);
    }
    



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
