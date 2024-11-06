import * as api from "./api_service.js";
import { LoginView } from "./views/admin_views/admin_login_view.js";
import { AdminPanelView } from "./views/admin_views/admin_panel_view.js";
import { adminProductsView } from "./views/admin_views/admin_product_view.js";

const viewContainer = document.getElementById("viewContainer");

const testBtn = document.getElementById("btnShowCategories");

const loginView = new LoginView();
const adminPanelView = new AdminPanelView();
const adminProducts = new adminProductsView();

//startup-------------------------------------------

viewContainer.innerHTML = "";
viewContainer.appendChild(loginView);
let deleteChocolates = api.chocolatesForDeletion();

//For storing the adminToken later
let adminToken = null;

//log in as admin-----------------------------------
loginView.addEventListener("log-in", function(evt){
    //the "log-in" tag in the eventListener sends the username and password to the server
    const logInPromise = api.logIn(evt.detail);
    
    logInPromise.then((result) => {
        adminToken = result.token;
            viewContainer.innerHTML ="";
            viewContainer.appendChild(adminPanelView)
            adminPanelView.refresh();  
    });
});


adminPanelView.addEventListener("admin-products", function(evt){
    viewContainer.innerHTML = "";
    adminProducts.chocoDeletionList(deleteChocolates);
    viewContainer.appendChild(adminProducts);
});

adminProducts.addEventListener("add-product", function(evt){
    api.adminProducts(adminToken, evt.detail).then(response => {
        deleteChocolates = api.chocolatesForDeletion();

        adminProducts.chocoDeletionList(deleteChocolates);
        viewContainer.appendChild(adminProducts);

        this.form.reset();  
    });
});

adminProducts.addEventListener("delete-product", function(evt){
    evt.preventDefault();
    api.deleteProduct(adminToken, evt.detail).then(response =>{
        deleteChocolates = api.chocolatesForDeletion();

        adminProducts.chocoDeletionList(deleteChocolates);
        viewContainer.appendChild(adminProducts);
    });
})