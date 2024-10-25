import * as api from "./api_service.js";
import { LoginView } from "./views/admin_views/admin_login_view.js";

const viewContainer = document.getElementById("viewContainer");


const loginView = new LoginView();


//startup-------------------------------------------

viewContainer.innerHTML = "";
viewContainer.appendChild(loginView);


//log in as admin-----------------------------------
loginView.addEventListener("log-in", function(evt){
    api.logIn(evt.detail);

    //Trying to empty view-container
    //Need to find a way to transfer boolean into refresh function. 
    /* Alternative: add boolean to "adminControlPanel" function in api.service.js
        then use loginView.refresh(adminControlPanel)
    */
    loginView.refresh(true);
});