const html = `
<div id="chosen-thread-container"> </div>
`;


//===================================================
export class IndividualThreadView extends HTMLElement{

    constructor(){

        super();
        this.attachShadow({mode:"open"});
        this.shadowRoot.innerHTML = html;
        this.chosenThreadContainer = this.shadowRoot.getElementById("chosen-recipe-container");
    }

    async refresh(dataPromise){
        const chosenThread = await dataPromise; 
        this.chosenThreadContainer.innerHTML = "";

        const theDiv = document.createElement("div");

        theDiv.innerHTML = `
            <h1>${chosenThread.heading}<h1>
            <p>${chosenThread.message}</p>
        `;

        this.chosenThreadContainer.appendChild(theDiv);
    }



}
