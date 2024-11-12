import * as api from "./api_service.js";
import { AdminLoginView } from "./views/admin_views/admin_login_view.js";
import { AdminPanelView } from "./views/admin_views/admin_panel_view.js";
import { adminProductsView } from "./views/admin_views/admin_product_view.js";
import { changeProductView } from "./views/admin_views/admin_product_change_view.js";
import { UserListView } from "./views/admin_views/admin_users_view.js";


const viewContainer = document.getElementById("viewContainer");

const homeBtn = document.getElementById("back-to-admin-start");

const adminLoginView = new AdminLoginView();
const adminPanelView = new AdminPanelView();
const adminProducts = new adminProductsView();
const allUserView = new UserListView();

const changeProductInfo = new changeProductView();

//startup-------------------------------------------

viewContainer.innerHTML = "";
viewContainer.appendChild(adminLoginView);
let adjustableChocolateList = api.adjustableChocolateList();

//For storing the adminToken later
let adminToken = null;

//log in as admin-----------------------------------
adminLoginView.addEventListener("log-in", function(evt){
    //the "log-in" tag in the eventListener sends the username and password to the server
    const logInPromise = api.logIn(evt.detail, "admin");
    logInPromise.then((result) => {
        adminToken = result.token;
            viewContainer.innerHTML ="";
            viewContainer.appendChild(adminPanelView)
            adminPanelView.refresh();  
    });
});

//Back to start-page
//This is only for quick navigation. Later, it needs to be restricted to log-in. 
homeBtn.addEventListener("click", function(evt){
    viewContainer.innerHTML ="";
    viewContainer.appendChild(adminPanelView)
    adminPanelView.refresh();  
});


//Administration of products
adminPanelView.addEventListener("admin-products", function(evt){
    viewContainer.innerHTML = "";
    adminProducts.chocoDeletionList(adjustableChocolateList);
    viewContainer.appendChild(adminProducts);
});

adminPanelView.addEventListener("admin-users", e => {
    viewContainer.innerHTML = "";
    api.getAllUsers(adminToken).then((userList) => {
        console.log(userList);
        allUserView.listUsers(userList);
        viewContainer.appendChild(allUserView);
    });
});



allUserView.addEventListener("delete-user", e => {
    viewContainer.innerHTML = "";

    api.deleteUser(adminToken, e.detail).then((result) => {
        const refreshUserList = api.getAllUsers(adminToken);
        allUserView.listUsers(refreshUserList);
        viewContainer.appendChild(allUserView);
    });
});



adminProducts.addEventListener("add-product", function(evt){
    api.adminProducts(adminToken, evt.detail).then(response => {
        adjustableChocolateList = api.adjustableChocolateList();

        adminProducts.chocoDeletionList(adjustableChocolateList);
        viewContainer.appendChild(adminProducts);

        this.form.reset();  
    });
});

adminProducts.addEventListener("delete-product", function(evt){
    api.deleteProduct(adminToken, evt.detail).then(response =>{
        adjustableChocolateList = api.adjustableChocolateList();

        adminProducts.chocoDeletionList(adjustableChocolateList);
        viewContainer.appendChild(adminProducts);
    });
});


adminProducts.addEventListener("change-product-form", function(evt){
    viewContainer.innerHTML = "";
    changeProductInfo.changeableChoco(adjustableChocolateList);
    viewContainer.appendChild(changeProductInfo);
});


changeProductInfo.addEventListener("change-product", function(evt){
    api.changeProduct(adminToken, evt.detail).then(response=>{
        adjustableChocolateList = api.adjustableChocolateList();

        changeProductInfo.changeableChoco(adjustableChocolateList);
        viewContainer.appendChild(changeProductInfo);
        this.form.reset();
    });
});


