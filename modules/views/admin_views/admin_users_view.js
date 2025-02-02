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

            this.deleteEvent(this.userToDelete.value);

            this.userToDelete.value = "";
        })
    
    }

//------------------------------------------------------
    deleteEvent(userId){
        const deleteEvent = new CustomEvent("delete-user", { composed: true, bubbles: true, detail: userId });
        this.dispatchEvent(deleteEvent); 
    }

//------------------------------------------------------
    async listUsers(dataPromise){
        this.userContainer.innerHTML = "";
        
        const data = await dataPromise;
        if(data.length != 0){
            for(let value of data){
                const userDiv = document.createElement("div");
                userDiv.innerHTML = `
                <div class="user-entry">
                    <div class="user-info">
                        <h3>username: ${value.username}</h3>
                        <h4>user id: ${value.id}</h4>
                    </div>
                    <button class="user-entry-delete-btn">Delete this user</button>
                </div>
                    <hr>
                `;

                const deleteButton = userDiv.querySelector(".user-entry-delete-btn");
                deleteButton.addEventListener("click", () => {
                    this.deleteEvent(value.id);
                });

            this.userContainer.appendChild(userDiv);
            }
        } else {
            const userDiv = document.createElement("div");
            userDiv.innerHTML = `
            <h3>No users in our community... sad.</h3>
            `;
            this.userContainer.appendChild(userDiv);
        }
    }
}

customElements.define("user-list-view", UserListView);