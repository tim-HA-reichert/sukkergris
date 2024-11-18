const html = `
<h2>User forum</h2>
<hr>
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
                
                <h6>Posted by: ${value.username}</h6> 
                <p>Date: ${value.date}</p>
                <hr>
            `;
            
            theDiv.addEventListener('click', evt => {
                const wishToInspectEvent = new CustomEvent("wish-to-inspect", {composed: true, bubbles:true, detail: value});
                this.dispatchEvent(wishToInspectEvent);
            });

            this.threadContainer.appendChild(theDiv);
        }
    }
}

customElements.define("thread-list-view", ThreadListView);






