import * as api from "./api_service.js";
import { LoginView } from "./views/admin_views/admin_login_view.js";

const viewContainer = document.getElementById("viewContainer");


const loginView = new LoginView();


//startup-------------------------------------------

viewContainer.innerHTML = "";
viewContainer.appendChild(loginView);


//log in as admin-----------------------------------

//Hjelp av GPT for async function.    this
loginView.addEventListener("log-in", async function(evt){
    // Wait for the result from logIn to get isSuper
    const isSuper = await api.logIn(evt.detail);

    // Refresh view based on the isSuper boolean value
    loginView.refresh(isSuper);
});