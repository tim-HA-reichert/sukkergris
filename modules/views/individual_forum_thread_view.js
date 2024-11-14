const html = `
<div id="chosen-thread"> </div>
<hr>
<div id="comment-container"> </div>

<h5>Care to comment?</h5>

<form id="comment-form">
       <!--<label for="comment-text">Comment: </label>-->

        <textarea type="text" id="comment-text" name="comment-text"
            placeholder="Add a comment!"> </textarea>
        <button type="submit-comment"> Comment! </button>

</form>

<button id="delete-thread-btn">Delete thread</button>
`;


//===================================================
export class IndividualThreadView extends HTMLElement{

    constructor(){

        super();
        this.attachShadow({mode:"open"});
        this.shadowRoot.innerHTML = html;
        this.chosenThread = this.shadowRoot.getElementById("chosen-thread");

        this.commentForm = this.shadowRoot.getElementById("comment-form");
        this.commentContainer = this.shadowRoot.getElementById("comment-container");

        this.deleteThreadBtn = this.shadowRoot.getElementById("delete-thread-btn");

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
            <h6>thread by:A user(TBA)</h6>
        `;  
        this.chosenThread.appendChild(theDiv);
    }

    async comment(commentData){
        this.commentContainer.innerHTML = "";

        const comments = await commentData;
        console.log(comments);

        for(let value of comments){
            const commentDiv = document.createElement("div");

//Need to find a way to match value.user_id to id from another model.  
            commentDiv.innerHTML = `
                <p>${value.message}</p>
                <h6>Posted by user: ${value.user_id}</h6>
                <hr>
                `;

            this.commentContainer.appendChild(commentDiv);
        }
    }
}

customElements.define("individual-thread-view", IndividualThreadView);
