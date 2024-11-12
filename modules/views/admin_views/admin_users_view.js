const html = `
    <h2>All users</h2>

    <div class="content-wrapper">
    <input name="delete-user" id="delete-user" type="number" placeholder="use ID to delete user" required>
    <button id="delete-user-button">Delete user with ID</button>
<div> 
<hr>
    <div id="userContainer"></div>
`;


//===================================================
export class UserListView extends HTMLElement {



    //---------------------------------------
    constructor(){

        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = html;
        this.userContainer = this.shadowRoot.getElementById("userContainer");

        this.deleteUserBtn = this.shadowRoot.getElementById("delete-user-button");
        this.userToDelete = this.shadowRoot.getElementById("delete-user");
    
        this.deleteUserBtn.addEventListener("click", e => {
            e.preventDefault();

            
            const deleteEvent = new CustomEvent("delete-user", 
                {composed: true, bubbles: true, detail: this.userToDelete.value});

            this.dispatchEvent(deleteEvent);

            this.userToDelete.value = "";
        })
    
    }


    async listUsers(dataPromise){
        this.userContainer.innerHTML = "";

        const data = await dataPromise;

        for(let value of data){

            const userDiv = document.createElement("div");
            userDiv.innerHTML = `
                <h3>username: ${value.username}</h3>
                <h4>user id: ${value.id}</h4>
                <hr>
            `;
            this.userContainer.appendChild(userDiv);
        }
    }
}

customElements.define("user-list-view", UserListView);