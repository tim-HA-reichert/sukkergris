const html = `
<link rel="stylesheet" href="styles/create_thread_view_style.css">
    <h2>Create a new topic!</h2>
    <h4>We encourage our members to discuss all things candy.</h4>

    <div id="threadContainer"> 

        <form id="new-thread-form" action="">
            <label for="thread-title">Topic Title:</label>
            <input type="text" id="thread-title" name="thread-title"
                placeholder="Give your topic a name!">

            <label for="thread-text">Topic Description:</label>
            <textarea type="text" id="thread-text" name="thread-text"
                placeholder="Describe the topic."></textarea>

            <button id="btn-forum-topic" type="submit">Submit to forums!</button>
        </form>
    </div>
`;

export class CreateNewThreadView extends HTMLElement {

    constructor(){
        
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById("new-thread-form");
    
        this.form.addEventListener("submit", evt => {
            evt.preventDefault();

            const formData = new FormData(this.form);

            const newThreadEvent = new CustomEvent("submit-new-thread", {composed: true, bubbles:true, detail: formData});
            this.dispatchEvent(newThreadEvent);
        });
    }
}//End of class

customElements.define("new-thread-view", CreateNewThreadView);