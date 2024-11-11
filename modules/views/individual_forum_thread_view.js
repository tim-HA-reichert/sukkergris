const html = `
<div id="chosen-thread-container"> </div>
<hr>
<h5>Care to comment?</h5>
`;


//===================================================
export class IndividualThreadView extends HTMLElement{

    constructor(){

        super();
        this.attachShadow({mode:"open"});
        this.shadowRoot.innerHTML = html;
        this.chosenThread = this.shadowRoot.getElementById("chosen-thread-container");
    }

    async refresh(dataPromise){
        this.chosenThread.innerHTML = "";

        const chosenThread = await dataPromise; 

        const theDiv = document.createElement("div");

        theDiv.innerHTML = `
            <h1>${chosenThread.heading}</h1>
            <p>${chosenThread.message}</p>
        `;

        //Need to add: Comment functionality
        //Perhaps in the shape of a "form"?


        this.chosenThread.appendChild(theDiv);
    }
}

customElements.define("individual-thread-view", IndividualThreadView);
