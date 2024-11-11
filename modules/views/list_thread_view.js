const html = `
<h2>User forum</h2>
<div id="threadContainer"> </div>
`;


//===================================================
export class ThreadListView extends HTMLElement {

    //---------------------------------------
    constructor(){

        super();
        
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.threadContainer = this.shadowRoot.getElementById("threadContainer");
    }

    //---------------------------------------
    async loadThreads(threadData){
        this.threadContainer.innerHTML = "";

        const threads = await threadData;
        
        for(let value of threads){

            const theDiv = document.createElement("div");
            theDiv.innerHTML = `
                <h3>${value.heading}</h3>
                <p>${value.message}</p>
                <hr>
            `;

            this.threadContainer.appendChild(theDiv);

            theDiv.addEventListener('click', evt => {
                const wishToCommentEvent = new CustomEvent("wish-to-comment", {composed: true, bubbles:true, detail: value});
                console.log(wishToCommentEvent);
                this.dispatchEvent(wishToCommentEvent);
            });
        }

    }
}

customElements.define("thread-list-view", ThreadListView);






